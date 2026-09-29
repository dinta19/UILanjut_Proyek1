<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Recipe, CookingStep } from '../../types/recipe'
import { useVoiceAssistant } from '../../composables/useVoiceAssistant'

const props = defineProps<{
  recipe: Recipe
  initialStepIndex?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const currentStepIndex = ref(props.initialStepIndex || 0)
const autoSpeakEnabled = ref(true)

// Steps helper
const fallbackStep: CookingStep = {
  stepNumber: 1,
  title: 'Mempersiapkan Bahan',
  instruction: 'Siapkan seluruh bahan masakan dan alat pendukung yang diperlukan.'
}

const totalSteps = computed(() => props.recipe.steps.length)
const currentStep = computed<CookingStep>(() => {
  return props.recipe.steps[currentStepIndex.value] ?? props.recipe.steps[0] ?? fallbackStep
})
const progressPercentage = computed(() =>
  Math.round(((currentStepIndex.value + 1) / totalSteps.value) * 100)
)

// Timer State
const timerSecondsRemaining = ref(0)
const timerTotalSeconds = ref(0)
const isTimerRunning = ref(false)
const isTimerPaused = ref(false)
let timerInterval: any = null

const formattedTimer = computed(() => {
  const mins = Math.floor(timerSecondsRemaining.value / 60)
  const secs = timerSecondsRemaining.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const setupTimerForStep = () => {
  stopTimer()
  isTimerPaused.value = false
  if (currentStep.value.durationMinutes) {
    timerTotalSeconds.value = currentStep.value.durationMinutes * 60
    timerSecondsRemaining.value = timerTotalSeconds.value
  } else {
    timerTotalSeconds.value = 0
    timerSecondsRemaining.value = 0
  }
}

const startTimer = (triggeredByVoice = false) => {
  const wasPaused = isTimerPaused.value

  if (timerSecondsRemaining.value <= 0) {
    if (currentStep.value.durationMinutes) {
      timerSecondsRemaining.value = currentStep.value.durationMinutes * 60
      timerTotalSeconds.value = timerSecondsRemaining.value
    } else {
      // Default fallback 3 menit
      timerSecondsRemaining.value = 3 * 60
      timerTotalSeconds.value = timerSecondsRemaining.value
    }
  }

  isTimerRunning.value = true
  isTimerPaused.value = false
  clearInterval(timerInterval)

  // Human-Computer Interaction Voice Feedback
  if (autoSpeakEnabled.value && triggeredByVoice) {
    if (wasPaused) {
      voice.speakText('Timer dilanjutkan.')
    } else {
      const minutes = Math.ceil(timerSecondsRemaining.value / 60)
      voice.speakText(`Timer ${minutes} menit dimulai.`)
    }
  }

  timerInterval = setInterval(() => {
    if (timerSecondsRemaining.value > 0) {
      timerSecondsRemaining.value--
    } else {
      stopTimer()
      voice.playSoundFeedback('timer-done')
      if (autoSpeakEnabled.value) {
        voice.speakText(`Waktu memasak untuk langkah ${currentStepIndex.value + 1} telah selesai!`)
      }
    }
  }, 1000)
}

const pauseTimer = (triggeredByVoice = false) => {
  // Hanya jeda jika timer sedang berjalan atau ada sisa waktu
  if (isTimerRunning.value || timerSecondsRemaining.value > 0) {
    isTimerRunning.value = false
    isTimerPaused.value = true
    clearInterval(timerInterval)

    // Human-Computer Interaction: Berikan umpan balik verbal bahwa perintah suara berhasil dieksekusi
    if (autoSpeakEnabled.value && triggeredByVoice) {
      voice.speakText('Timer telah dijeda. Katakan mulai timer untuk melanjutkan.')
    }
  }
}

const stopTimer = () => {
  isTimerRunning.value = false
  isTimerPaused.value = false
  clearInterval(timerInterval)
}

const resetTimer = (triggeredByVoice = false) => {
  stopTimer()
  if (currentStep.value.durationMinutes) {
    timerSecondsRemaining.value = currentStep.value.durationMinutes * 60
  } else {
    timerSecondsRemaining.value = 0
  }

  if (autoSpeakEnabled.value && triggeredByVoice) {
    voice.speakText('Timer diatur ulang.')
  }
}

// Read current step via Text-to-Speech
const readCurrentStep = () => {
  if (!currentStep.value) return
  const text = `Langkah ${currentStepIndex.value + 1}. ${currentStep.value.title}. ${currentStep.value.instruction}`
  voice.speakText(text)
}

// Step navigation
const nextStep = () => {
  if (currentStepIndex.value < totalSteps.value - 1) {
    currentStepIndex.value++
  } else {
    voice.speakText('Selamat! Anda telah menyelesaikan seluruh langkah memasak.')
  }
}

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

// Voice Assistant integration
const voice = useVoiceAssistant({
  onNext: () => nextStep(),
  onPrev: () => prevStep(),
  onRepeat: () => readCurrentStep(),
  onTimerStart: () => startTimer(true),
  onTimerPause: () => pauseTimer(true),
  onTimerReset: () => resetTimer(true),
  onClose: () => emit('close')
})

// React to step change
watch(currentStepIndex, () => {
  setupTimerForStep()
  if (autoSpeakEnabled.value) {
    readCurrentStep()
  }
})

// Keyboard shortcuts for kitchen accessibility
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'Space') {
    e.preventDefault()
    nextStep()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevStep()
  } else if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  setupTimerForStep()
  // Auto-start voice recognition on enter
  voice.startListening()
  if (autoSpeakEnabled.value) {
    // Initial welcome announcement
    setTimeout(() => {
      voice.speakText(`Mode Masak Hands-Free untuk ${props.recipe.title}. Katakan Lanjut untuk berpindah langkah.`)
    }, 600)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  stopTimer()
  voice.stopListening()
  voice.stopSpeaking()
})
</script>

<template>
  <div class="cooking-modal-backdrop">
    <div class="cooking-mode-container">
      <!-- Top Navigation & Status Bar -->
      <header class="cooking-header">
        <div class="header-left">
          <span class="cooking-badge">🧑‍🍳 COOKING ASSISTANT MODE</span>
          <h2 class="recipe-name-pill">{{ recipe.title }}</h2>
        </div>

        <div class="header-center">
          <div class="voice-status-indicator" :class="{ listening: voice.isListening.value }">
            <span class="mic-wave-pulse" v-if="voice.isListening.value"></span>
            <span class="mic-emoji">{{ voice.isListening.value ? '🎙️' : '🔇' }}</span>
            <span class="voice-status-text">
              {{ voice.isListening.value ? 'Mikrofon Aktif (Mendengarkan...)' : 'Mikrofon Nonaktif' }}
            </span>
            <button
              class="mic-toggle-btn"
              @click="voice.toggleListening()"
              :title="voice.isListening.value ? 'Matikan Suara' : 'Aktifkan Suara'"
            >
              {{ voice.isListening.value ? 'Jeda Mic' : 'Nyalakan Mic' }}
            </button>
          </div>
        </div>

        <div class="header-right">
          <button
            class="action-pill-btn"
            :class="{ active: autoSpeakEnabled }"
            @click="autoSpeakEnabled = !autoSpeakEnabled"
            title="Otomatis bacakan instruksi saat langkah berganti"
          >
            <span>{{ autoSpeakEnabled ? '🔊 Suara Narator Aktif' : '🔇 Narator Senyap' }}</span>
          </button>

          <button class="close-cooking-btn" @click="emit('close')" title="Keluar dari Mode Masak (Esc)">
            ✕ Keluar
          </button>
        </div>
      </header>

      <!-- Step Progress Bar -->
      <div class="progress-bar-wrapper">
        <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <!-- Main Stage Content -->
      <main class="cooking-main-stage">
        <!-- Live Transcript Feedback Pill -->
        <div v-if="voice.lastCommand.value" class="voice-transcript-banner fade-in">
          <span class="ai-spark">✨</span>
          <span class="transcript-content">{{ voice.lastCommand.value }}</span>
        </div>

        <div class="step-card-hero">
          <div class="step-badge-large">
            <span class="badge-sub">LANGKAH</span>
            <span class="badge-num">{{ currentStepIndex + 1 }}</span>
            <span class="badge-total">dari {{ totalSteps }}</span>
          </div>

          <div class="step-content-area">
            <h1 class="step-headline">{{ currentStep.title }}</h1>
            <p class="step-instruction-big">{{ currentStep.instruction }}</p>

            <div v-if="currentStep.tip" class="step-pro-tip">
              <span class="tip-icon">💡</span>
              <div class="tip-text">
                <strong>Tips Dapur:</strong> {{ currentStep.tip }}
              </div>
            </div>

            <!-- Interactive Smart Timer Widget inside step -->
            <div
              v-if="currentStep.durationMinutes || timerSecondsRemaining > 0"
              class="step-timer-box"
              :class="{ 'timer-paused': isTimerPaused, 'timer-running': isTimerRunning }"
            >
              <div class="timer-display">
                <span class="timer-icon">{{ isTimerPaused ? '⏸️' : (isTimerRunning ? '⏳' : '⏱️') }}</span>
                <span class="timer-digits" :class="{ 'paused-digits': isTimerPaused }">{{ formattedTimer }}</span>
                <div class="timer-label-col">
                  <span class="timer-label">Durasi Masak</span>
                  <span v-if="isTimerPaused" class="timer-state-pill paused">⏸️ DIJEDA</span>
                  <span v-else-if="isTimerRunning" class="timer-state-pill running">⏳ BERJALAN</span>
                </div>
              </div>

              <div class="timer-actions">
                <button
                  v-if="!isTimerRunning"
                  class="btn-timer-action play"
                  @click="startTimer(false)"
                >
                  {{ isTimerPaused ? '▶ Lanjutkan' : '▶ Mulai Timer' }}
                </button>
                <button
                  v-else
                  class="btn-timer-action pause"
                  @click="pauseTimer(false)"
                >
                  ⏸ Jeda Timer
                </button>
                <button class="btn-timer-action reset" @click="resetTimer(false)">
                  ↺ Reset
                </button>
              </div>

              <!-- Live HCI Visual Cue when Paused -->
              <div v-if="isTimerPaused" class="timer-paused-notice">
                <span>💬 Katakan <strong>"Mulai Timer"</strong> atau <strong>"Lanjut"</strong> untuk meneruskan hitungan</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Tactile Bar & Voice Commands Quick Guide -->
      <footer class="cooking-footer">
        <!-- Voice Command Cheatsheet for Kitchen User -->
        <div class="voice-cheatsheet">
          <span class="cheat-label">🗣️ Perintah Suara yang Dikenali:</span>
          <div class="cheat-chips">
            <span class="cheat-chip" @click="nextStep()">👉 "Lanjut"</span>
            <span class="cheat-chip" @click="prevStep()">👈 "Kembali"</span>
            <span class="cheat-chip" @click="readCurrentStep()">📢 "Baca Ulang"</span>
            <span class="cheat-chip" @click="startTimer(true)">⏱️ "Mulai Timer"</span>
            <span class="cheat-chip chip-pause" @click="pauseTimer(true)">⏸️ "Jeda Timer"</span>
            <span class="cheat-chip" @click="resetTimer(true)">↺ "Reset Timer"</span>
            <span class="cheat-chip" @click="emit('close')">🚪 "Selesai"</span>
          </div>
        </div>

        <!-- Big Navigation Buttons -->
        <div class="step-action-buttons">
          <button
            class="btn-step-nav prev"
            :disabled="currentStepIndex === 0"
            @click="prevStep"
          >
            ← Langkah Sebelumnya
          </button>

          <button class="btn-step-speak" @click="readCurrentStep" title="Bacakan instruksi langkah ini">
            <span>📢 {{ voice.isSpeaking.value ? 'Sedang Membaca...' : 'Bacakan Ulang' }}</span>
          </button>

          <button
            class="btn-step-nav next"
            v-if="currentStepIndex < totalSteps - 1"
            @click="nextStep"
          >
            Langkah Selanjutnya →
          </button>

          <button
            class="btn-step-nav finish"
            v-else
            @click="emit('close')"
          >
            🎉 Selesai Memasak!
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.cooking-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: #12100e;
  color: #f7f4ee;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: fadeIn 0.25s ease-out;
}

.cooking-mode-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
}

/* Header */
.cooking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cooking-badge {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: #ea580c;
  font-weight: 800;
}

.recipe-name-pill {
  font-size: 1.25rem;
  font-family: var(--font-serif, serif);
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.voice-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  position: relative;
}

.voice-status-indicator.listening {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
}

.mic-wave-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulseMic 1.6s infinite;
}

@keyframes pulseMic {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.voice-status-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
}

.mic-toggle-btn {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.18);
  color: white;
  margin-left: 0.25rem;
}

.mic-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-pill-btn {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.action-pill-btn.active {
  background: rgba(217, 72, 20, 0.2);
  border-color: #d94814;
  color: #ffedd5;
}

.close-cooking-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 700;
  background: #334155;
  color: white;
  transition: all 0.2s;
}

.close-cooking-btn:hover {
  background: #dc2626;
}

/* Progress bar */
.progress-bar-wrapper {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ea580c, #f59e0b);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Main Stage */
.cooking-main-stage {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 0;
}

.voice-transcript-banner {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(234, 88, 12, 0.15);
  border: 1px solid rgba(234, 88, 12, 0.35);
  color: #fed7aa;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.step-card-hero {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 3rem;
  align-items: start;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 3.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.step-badge-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #26211c, #1a1613);
  border: 2px solid #ea580c;
  border-radius: 24px;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(234, 88, 12, 0.2);
}

.badge-sub {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #ea580c;
}

.badge-num {
  font-size: 4.5rem;
  font-family: var(--font-serif, serif);
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  margin: 0.5rem 0;
}

.badge-total {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

.step-content-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-headline {
  font-family: var(--font-serif, serif);
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
}

.step-instruction-big {
  font-size: 1.45rem;
  line-height: 1.75;
  color: #e2e8f0;
  font-weight: 400;
}

.step-pro-tip {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  border-left: 4px solid #f59e0b;
  padding: 1rem 1.25rem;
  border-radius: 0 12px 12px 0;
  font-size: 1.05rem;
  color: #fef3c7;
}

.step-timer-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  padding: 1.25rem 1.75rem;
  border-radius: 18px;
  width: fit-content;
  margin-top: 1rem;
  transition: all 0.25s ease;
}

.step-timer-box.timer-running {
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.06);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
}

.step-timer-box.timer-paused {
  border-color: rgba(245, 158, 11, 0.6);
  background: rgba(245, 158, 11, 0.09);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timer-icon {
  font-size: 2rem;
  line-height: 1;
}

.timer-digits {
  font-family: monospace;
  font-size: 2.3rem;
  font-weight: 800;
  color: #f59e0b;
  letter-spacing: 0.05em;
  transition: opacity 0.3s ease;
}

.timer-digits.paused-digits {
  color: #fbbf24;
  animation: blinkTimer 1.2s infinite ease-in-out;
}

@keyframes blinkTimer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.timer-label-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timer-label {
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
}

.timer-state-pill {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  letter-spacing: 0.04em;
  width: fit-content;
}

.timer-state-pill.paused {
  background: #f59e0b;
  color: #1a1613;
}

.timer-state-pill.running {
  background: #16a34a;
  color: #ffffff;
}

.timer-paused-notice {
  font-size: 0.85rem;
  color: #fef08a;
  background: rgba(245, 158, 11, 0.12);
  border: 1px dashed rgba(245, 158, 11, 0.4);
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
}

.timer-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-timer-action {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-timer-action.play {
  background: #16a34a;
  color: white;
}

.btn-timer-action.pause {
  background: #d97706;
  color: white;
}

.btn-timer-action.reset {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

/* Footer & Controls */
.cooking-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.voice-cheatsheet {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cheat-label {
  font-size: 0.88rem;
  color: #94a3b8;
  font-weight: 600;
}

.cheat-chips {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cheat-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.cheat-chip:hover {
  background: rgba(234, 88, 12, 0.2);
  border-color: #ea580c;
  color: #fed7aa;
}

.cheat-chip.chip-pause {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
  color: #fef08a;
}

.cheat-chip.chip-pause:hover {
  background: rgba(245, 158, 11, 0.25);
  border-color: #f59e0b;
}

.step-action-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.btn-step-nav {
  padding: 1.1rem 2.2rem;
  border-radius: 16px;
  font-size: 1.15rem;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-step-nav.prev {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-step-nav.prev:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.btn-step-nav:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-step-speak {
  padding: 1rem 1.8rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 600;
}

.btn-step-speak:hover {
  background: rgba(255, 255, 255, 0.12);
}

.btn-step-nav.next {
  background: #ea580c;
  color: white;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.4);
}

.btn-step-nav.next:hover {
  background: #c2410c;
  transform: translateY(-2px);
}

.btn-step-nav.finish {
  background: #16a34a;
  color: white;
  box-shadow: 0 4px 20px rgba(22, 163, 74, 0.4);
}

.btn-step-nav.finish:hover {
  background: #15803d;
}

@media (max-width: 900px) {
  .step-card-hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem;
  }

  .step-badge-large {
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
  }

  .badge-num {
    font-size: 2.5rem;
    margin: 0;
  }

  .step-headline {
    font-size: 1.6rem;
  }

  .step-instruction-big {
    font-size: 1.15rem;
  }

  .step-action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn-step-nav, .btn-step-speak {
    width: 100%;
    text-align: center;
  }
}
</style>
