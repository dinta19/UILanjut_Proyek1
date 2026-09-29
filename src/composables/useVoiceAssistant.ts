import { ref, onUnmounted } from 'vue'

export type VoiceAction =
  | 'next'
  | 'prev'
  | 'repeat'
  | 'timer-start'
  | 'timer-pause'
  | 'timer-reset'
  | 'close'
  | 'unknown'

export interface VoiceAssistantOptions {
  onNext?: () => void
  onPrev?: () => void
  onRepeat?: () => void
  onTimerStart?: () => void
  onTimerPause?: () => void
  onTimerReset?: () => void
  onClose?: () => void
}

export function useVoiceAssistant(options: VoiceAssistantOptions = {}) {
  const isListening = ref(false)
  const isSpeaking = ref(false)
  const transcript = ref('')
  const lastCommand = ref('')
  const isSupported = ref(false)
  const errorMessage = ref('')

  let active = false
  let lastActionTimestamp = 0
  let ignoreVoiceUntil = 0

  // Check Web Speech API support
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (SpeechRecognition) {
    isSupported.value = true
  }

  // Play pleasant acoustic feedback beep using Web Audio API
  const playSoundFeedback = (type: 'success' | 'ping' | 'timer-done' | 'pause') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      } else if (type === 'pause') {
        osc.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.16) // A4
        gain.gain.setValueAtTime(0.14, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22)
        osc.start()
        osc.stop(ctx.currentTime + 0.22)
      } else if (type === 'timer-done') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.2)
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
        osc.start()
        osc.stop(ctx.currentTime + 0.8)
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
        osc.start()
        osc.stop(ctx.currentTime + 0.12)
      }
    } catch {
      // AudioContext muted/unsupported
    }
  }

  // Text-To-Speech (Membacakan langkah suara dalam Bahasa Indonesia)
  const speakText = (text: string, onFinish?: () => void) => {
    if (!('speechSynthesis' in window)) return

    try {
      window.speechSynthesis.cancel()

      const cleanText = text.replace(/[*_#`]/g, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = 'id-ID'
      utterance.rate = 1.0
      utterance.pitch = 1.0

      const voices = window.speechSynthesis.getVoices()
      const idVoice = voices.find((v) => v.lang.startsWith('id'))
      if (idVoice) {
        utterance.voice = idVoice
      }

      isSpeaking.value = true
      // Cegah mikrofon mendengar suara speaker sendiri selama TTS berbicara
      const estimatedDurationMs = Math.min(Math.max(cleanText.length * 75, 1000), 4000)
      ignoreVoiceUntil = Date.now() + estimatedDurationMs

      utterance.onend = () => {
        isSpeaking.value = false
        ignoreVoiceUntil = Date.now() + 400
        if (onFinish) onFinish()
      }

      utterance.onerror = () => {
        isSpeaking.value = false
        ignoreVoiceUntil = 0
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      isSpeaking.value = false
      ignoreVoiceUntil = 0
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
      ignoreVoiceUntil = 0
    }
  }

  // Text Normalizer to strip punctuation and extra spaces
  const clean = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[.,!?;:"'()[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Command parser with robust pattern matching for Indonesian voice instructions
  const parseCommand = (phrase: string): VoiceAction => {
    const p = clean(phrase)
    if (!p) return 'unknown'

    // 1. Timer Pause / Jeda (Fleksibel: mencakup semua variasi kata jeda/stop/pause)
    if (
      p.includes('jeda') ||
      p.includes('pause') ||
      p.includes('paus') ||
      p.includes('pos') ||
      p.includes('stop') ||
      p.includes('setop') ||
      p.includes('berhenti') ||
      p.includes('hentikan') ||
      p.includes('tahan') ||
      p.includes('tunda') ||
      p.includes('tunggu') ||
      p.includes('mati') ||
      p.includes('hold') ||
      p.includes('freeze')
    ) {
      return 'timer-pause'
    }

    // 2. Timer Reset
    if (
      p.includes('reset timer') ||
      p.includes('ulang timer') ||
      p.includes('atur ulang timer') ||
      p.includes('kembalikan timer') ||
      p.includes('nolkan timer') ||
      p.includes('reset') ||
      p.includes('atur ulang')
    ) {
      return 'timer-reset'
    }

    // 3. Timer Start / Lanjutkan Timer (Dievaluasi sebelum navigasi 'lanjut')
    if (
      p.includes('mulai timer') ||
      p.includes('start timer') ||
      p.includes('lanjutkan timer') ||
      p.includes('lanjut timer') ||
      p.includes('teruskan timer') ||
      p.includes('jalankan timer') ||
      p.includes('jalan timer') ||
      p.includes('pasang timer') ||
      p.includes('nyalakan timer') ||
      p.includes('setel timer') ||
      p.includes('hitung waktu') ||
      p.includes('mulai') ||
      p.includes('start') ||
      p.includes('jalankan') ||
      p === 'timer'
    ) {
      return 'timer-start'
    }

    // 4. Repeat / Read step (Baca Ulang)
    if (
      p.includes('baca ulang') ||
      p.includes('bacakan ulang') ||
      p.includes('baca lagi') ||
      p.includes('bacakan lagi') ||
      p.includes('ulangi baca') ||
      p.includes('ulang baca') ||
      p.includes('ulangi') ||
      p.includes('ulang') ||
      p.includes('bacakan') ||
      p.includes('baca') ||
      p.includes('suarakan') ||
      p.includes('repeat')
    ) {
      return 'repeat'
    }

    // 5. Next step (Lanjut)
    if (
      p.includes('lanjut') ||
      p.includes('selanjutnya') ||
      p.includes('berikutnya') ||
      p.includes('langkah depan') ||
      p.includes('langkah berikutnya') ||
      p.includes('langkah selanjutnya') ||
      p.includes('maju') ||
      p.includes('next') ||
      p.includes('terus')
    ) {
      return 'next'
    }

    // 6. Previous step (Kembali)
    if (
      p.includes('kembali') ||
      p.includes('mundur') ||
      p.includes('sebelumnya') ||
      p.includes('langkah sebelumnya') ||
      p.includes('balik') ||
      p.includes('back')
    ) {
      return 'prev'
    }

    // 7. Finish / Close mode (Selesai)
    if (
      p.includes('selesai') ||
      p.includes('keluar') ||
      p.includes('tutup') ||
      p.includes('beres') ||
      p.includes('exit') ||
      p.includes('close') ||
      p.includes('akhiri') ||
      p.includes('sudah')
    ) {
      return 'close'
    }

    return 'unknown'
  }

  // Handle detected voice transcript and trigger corresponding action
  const handleRecognizedText = (text: string) => {
    // Abaikan jika suara terdeteksi saat speaker/narator sedang berbunyi
    if (Date.now() < ignoreVoiceUntil) {
      console.log(`[VoiceAssistant] Diabaikan karena suara berasal dari narator: "${text}"`)
      return
    }

    transcript.value = text
    const action = parseCommand(text)
    console.log(`[VoiceAssistant] Dengar: "${text}" -> Aksi: ${action}`)

    if (action !== 'unknown') {
      const now = Date.now()
      // Cooldown 800ms agar tidak tereksekusi ganda
      if (now - lastActionTimestamp < 800) {
        return
      }
      lastActionTimestamp = now

      lastCommand.value = `Perintah: "${text}" (${action})`

      // Umpan balik suara
      if (action === 'timer-pause') {
        playSoundFeedback('pause')
      } else {
        playSoundFeedback('success')
      }

      switch (action) {
        case 'next':
          options.onNext?.()
          break
        case 'prev':
          options.onPrev?.()
          break
        case 'repeat':
          options.onRepeat?.()
          break
        case 'timer-start':
          options.onTimerStart?.()
          break
        case 'timer-pause':
          options.onTimerPause?.()
          break
        case 'timer-reset':
          options.onTimerReset?.()
          break
        case 'close':
          options.onClose?.()
          break
      }
    } else {
      lastCommand.value = `Mendengar: "${text}"`
    }
  }

  // Setup SpeechRecognition
  let recognition: any = null

  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'id-ID'

      recognition.onstart = () => {
        isListening.value = true
        errorMessage.value = ''
        console.log('[VoiceAssistant] Mikrofon aktif dan mendengarkan...')
      }

      recognition.onresult = (event: any) => {
        const current = event.resultIndex
        if (event.results && event.results[current]) {
          const text = event.results[current][0]?.transcript || ''
          if (text) {
            handleRecognizedText(text)
          }
        }
      }

      recognition.onerror = (event: any) => {
        console.warn('[VoiceAssistant] Error:', event.error)
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMessage.value = 'Izin mikrofon belum diberikan atau diblokir. Mohon izinkan mikrofon di browser Anda.'
          isListening.value = false
          active = false
        } else if (event.error === 'audio-capture') {
          errorMessage.value = 'Mikrofon tidak terdeteksi pada perangkat Anda.'
          isListening.value = false
          active = false
        } else if (event.error === 'network') {
          errorMessage.value = 'Koneksi suara browser terputus.'
        }
      }

      recognition.onend = () => {
        console.log('[VoiceAssistant] Sesi mikrofon terhenti sementara.')
        if (active) {
          // Restart dengan jeda 250ms agar Chrome melepas sesi sebelumnya
          setTimeout(() => {
            if (active) {
              try {
                recognition.start()
              } catch {
                // Ignore jika sudah berjalan
              }
            }
          }, 250)
        } else {
          isListening.value = false
        }
      }
    } catch (e) {
      console.error('[VoiceAssistant] Init error:', e)
    }
  }

  const startListening = () => {
    if (!SpeechRecognition) {
      errorMessage.value = 'Browser Anda belum mendukung Web Speech Recognition. Gunakan Google Chrome atau Microsoft Edge.'
      return
    }

    active = true
    errorMessage.value = ''

    if (recognition) {
      try {
        recognition.start()
        playSoundFeedback('ping')
      } catch {
        // Jika sudah aktif, abaikan
      }
    }
  }

  const stopListening = () => {
    active = false
    isListening.value = false
    if (recognition) {
      try {
        recognition.stop()
      } catch {
        // Ignore
      }
    }
  }

  const toggleListening = () => {
    if (active || isListening.value) {
      stopListening()
    } else {
      startListening()
    }
  }

  onUnmounted(() => {
    stopListening()
    stopSpeaking()
  })

  return {
    isListening,
    isSpeaking,
    transcript,
    lastCommand,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
    playSoundFeedback
  }
}
