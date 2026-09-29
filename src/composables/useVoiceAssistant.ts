import { ref, onUnmounted } from 'vue'

export type VoiceAction = 'next' | 'prev' | 'repeat' | 'timer-start' | 'timer-pause' | 'timer-reset' | 'close' | 'unknown'

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

  // Speech Recognition reference
  let recognition: any = null

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
        // Human-Computer Interaction: Tone menurun yang lembut menandakan aksi jeda (Pause)
        osc.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.16) // A4
        gain.gain.setValueAtTime(0.14, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22)
        osc.start()
        osc.stop(ctx.currentTime + 0.22)
      } else if (type === 'timer-done') {
        // High alert alarm chime
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.2)
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
        osc.start()
        osc.stop(ctx.currentTime + 0.8)
      } else {
        // Subtle ping
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
        osc.start()
        osc.stop(ctx.currentTime + 0.12)
      }
    } catch (e) {
      // AudioContext muted/unsupported
    }
  }

  // Text-To-Speech (Membacakan langkah suara dalam Bahasa Indonesia)
  const speakText = (text: string, onFinish?: () => void) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel() // Stop ongoing speech

    const cleanText = text.replace(/[*_#`]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'id-ID'
    utterance.rate = 1.0
    utterance.pitch = 1.0

    // Try finding an Indonesian voice if available
    const voices = window.speechSynthesis.getVoices()
    const idVoice = voices.find((v) => v.lang.startsWith('id'))
    if (idVoice) {
      utterance.voice = idVoice
    }

    isSpeaking.value = true

    utterance.onend = () => {
      isSpeaking.value = false
      if (onFinish) onFinish()
    }

    utterance.onerror = () => {
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
    }
  }

  // Command parser
  const parseCommand = (phrase: string): VoiceAction => {
    const p = phrase.toLowerCase().trim()

    // 1. Next step
    if (
      p.includes('lanjut') ||
      p.includes('next') ||
      p.includes('berikutnya') ||
      p.includes('selanjutnya') ||
      p.includes('maju') ||
      p.includes('langkah depan')
    ) {
      return 'next'
    }

    // 2. Previous step
    if (
      p.includes('kembali') ||
      p.includes('mundur') ||
      p.includes('sebelumnya') ||
      p.includes('back') ||
      p.includes('ulang langkah')
    ) {
      return 'prev'
    }

    // 3. Repeat / Read step
    if (
      p.includes('baca ulang') ||
      p.includes('ulangi') ||
      p.includes('baca lagi') ||
      p.includes('baca') ||
      p.includes('suarakan') ||
      p.includes('repeat')
    ) {
      return 'repeat'
    }

    // 4. Timer Pause / Jeda (Wajib dievaluasi sebelum generic 'timer' agar 'jeda timer' tidak tertukar)
    if (
      p.includes('jeda timer') ||
      p.includes('jeda') ||
      p.includes('pause timer') ||
      p.includes('pause') ||
      p.includes('stop timer') ||
      p.includes('berhenti timer') ||
      p.includes('hentikan timer') ||
      p.includes('matikan timer') ||
      p.includes('tahan timer') ||
      p.includes('tahan') ||
      p === 'stop' ||
      p === 'berhenti'
    ) {
      return 'timer-pause'
    }

    // 5. Timer Reset
    if (
      p.includes('reset timer') ||
      p.includes('ulang timer') ||
      p.includes('kembalikan timer') ||
      p === 'reset'
    ) {
      return 'timer-reset'
    }

    // 6. Timer Start / Lanjut
    if (
      p.includes('mulai timer') ||
      p.includes('jalan timer') ||
      p.includes('jalankan timer') ||
      p.includes('start timer') ||
      p.includes('lanjutkan timer') ||
      p.includes('lanjut timer') ||
      p.includes('hitung waktu') ||
      p.includes('pasang timer') ||
      p.includes('nyalakan timer') ||
      p === 'timer' ||
      p.startsWith('timer ')
    ) {
      return 'timer-start'
    }

    // 7. Close mode
    if (p.includes('keluar') || p.includes('tutup') || p.includes('selesai masak')) {
      return 'close'
    }

    return 'unknown'
  }

  const handleRecognizedText = (text: string) => {
    transcript.value = text
    const action = parseCommand(text)

    if (action !== 'unknown') {
      lastCommand.value = `Perintah terdeteksi: "${text}" (${action})`

      // HCI: Umpan balik suara adaptif
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
      lastCommand.value = `Mendengar: "${text}" (Katakan 'Lanjut', 'Kembali', atau 'Baca Ulang')`
    }
  }

  const initRecognition = () => {
    if (!SpeechRecognition) return

    recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'id-ID'

    recognition.onresult = (event: any) => {
      const current = event.resultIndex
      const resultText = event.results[current][0].transcript
      handleRecognizedText(resultText)
    }

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        errorMessage.value = 'Izin mikrofon ditolak oleh browser. Mohon izinkan akses mikrofon.'
        isListening.value = false
      }
    }

    recognition.onend = () => {
      // Auto-restart if user still wants it listening (continuous mode)
      if (isListening.value) {
        try {
          recognition.start()
        } catch {
          // Ignore duplicate start errors
        }
      }
    }
  }

  const startListening = () => {
    if (!SpeechRecognition) {
      errorMessage.value = 'Browser Anda belum mendukung Web Speech Recognition. Gunakan Google Chrome / Edge.'
      return
    }

    if (!recognition) {
      initRecognition()
    }

    try {
      isListening.value = true
      errorMessage.value = ''
      recognition.start()
      playSoundFeedback('ping')
    } catch (e) {
      console.warn('Could not start recognition', e)
    }
  }

  const stopListening = () => {
    isListening.value = false
    if (recognition) {
      try {
        recognition.stop()
      } catch (e) {
        // Ignore
      }
    }
  }

  const toggleListening = () => {
    if (isListening.value) {
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
