<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  askChefAi,
  getStoredApiKey,
  saveApiKey,
  type ChatMessage
} from '../../services/chefAiService'
import type { Recipe } from '../../types/recipe'

const router = useRouter()

// Widget visibility state
const isOpen = ref(false)
const showSettings = ref(false)
const apiKeyInput = ref('')
const isApiKeySaved = ref(false)

// Chat state
const inputPrompt = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Initial messages
const messages = ref<ChatMessage[]>([
  {
    id: 'welcome-msg',
    sender: 'assistant',
    text: 'Halo! Saya **Chef AI CookBook** 👨‍🍳✨\n\n' +
      'Bingung ingin masak apa hari ini? Tulis bahan yang kamu punya di kulkas atau tanyakan tips memasak apa saja, saya siap membantu!',
    timestamp: new Date(),
    suggestions: [
      'Punya telur & nasi dingin, masak apa?',
      'Cara bikin daging rendang cepat empuk',
      'Ide masakan praktis kurang dari 20 menit',
      'Cara bikin saus pasta creamy tanpa cream'
    ]
  }
])

onMounted(() => {
  apiKeyInput.value = getStoredApiKey()
})

const toggleWidget = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

const closeWidget = () => {
  isOpen.value = false
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const handleSaveApiKey = () => {
  saveApiKey(apiKeyInput.value)
  isApiKeySaved.value = true
  setTimeout(() => {
    isApiKeySaved.value = false
    showSettings.value = false
  }, 1200)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleSendMessage = async (textToSend?: string) => {
  const prompt = (textToSend || inputPrompt.value).trim()
  if (!prompt || isLoading.value) return

  // Add user message
  const userMsg: ChatMessage = {
    id: 'user-' + Date.now(),
    sender: 'user',
    text: prompt,
    timestamp: new Date()
  }
  messages.value.push(userMsg)
  inputPrompt.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const response = await askChefAi(prompt)
    const assistantMsg: ChatMessage = {
      id: 'assistant-' + Date.now(),
      sender: 'assistant',
      text: response.text,
      timestamp: new Date(),
      matchedRecipe: response.matchedRecipe,
      suggestions: response.suggestions
    }
    messages.value.push(assistantMsg)
  } catch (err: any) {
    messages.value.push({
      id: 'error-' + Date.now(),
      sender: 'assistant',
      text: 'Maaf, terjadi kendala saat memproses jawaban: ' + (err?.message || 'Silakan coba lagi.'),
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const selectSuggestion = (suggestion: string) => {
  handleSendMessage(suggestion)
}

const openRecipe = (recipe: Recipe) => {
  router.push(`/recipes/${recipe.id}`)
  // Optional: close widget or keep open
  isOpen.value = false
}

const clearChat = () => {
  messages.value = [
    {
      id: 'welcome-reset',
      sender: 'assistant',
      text: 'Percakapan telah direset. Mau masak apa hari ini? Tulis bahan yang kamu miliki atau tanyakan resep apa saja! 🍳',
      timestamp: new Date(),
      suggestions: [
        'Punya telur & nasi, masak apa?',
        'Resep masakan nusantara favorit',
        'Ide camilan manis sore hari'
      ]
    }
  ]
}

// Simple markdown formatter helper for bold, bullet points and linebreaks
const formatMarkdown = (text: string): string => {
  let formatted = text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Line breaks
    .replace(/\n/g, '<br>')

  return formatted
}
</script>

<template>
  <div class="chef-ai-container">
    <!-- Floating Action Button -->
    <button
      class="chef-ai-fab"
      :class="{ 'fab-active': isOpen }"
      @click="toggleWidget"
      aria-label="Buka Chat Chef AI"
      title="Tanya Chef AI CookBook"
    >
      <div class="fab-icon-wrap">
        <span class="fab-chef-icon">👨‍🍳</span>
        <span class="sparkle-badge">✨</span>
      </div>
      <div class="fab-label-pill">
        <span class="pulse-indicator"></span>
        <span>Tanya Chef AI</span>
      </div>
    </button>

    <!-- Chat Modal Window -->
    <transition name="chat-slide">
      <div v-if="isOpen" class="chef-ai-window" role="dialog" aria-label="Asisten Dapur Chef AI">
        <!-- Window Header -->
        <div class="window-header">
          <div class="header-chef-info">
            <div class="avatar-ring">
              <span class="chef-avatar">👨‍🍳</span>
              <span class="online-dot" title="Chef AI Online"></span>
            </div>
            <div class="header-titles">
              <div class="header-name-row">
                <h3>Chef AI CookBook</h3>
                <span class="ai-badge">AI Assistant</span>
              </div>
              <span class="status-subtitle">Konsultan Dapur &amp; Resep Kulkas</span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="header-controls">
            <button
              class="ctrl-btn"
              :class="{ active: showSettings }"
              @click="toggleSettings"
              title="Pengaturan API Key"
              aria-label="Pengaturan API Key"
            >
              ⚙️
            </button>
            <button class="ctrl-btn" @click="clearChat" title="Hapus Riwayat Chat" aria-label="Hapus Chat">
              🗑️
            </button>
            <button class="ctrl-btn close-btn" @click="closeWidget" title="Tutup Chat" aria-label="Tutup Chat">
              ✕
            </button>
          </div>
        </div>

        <!-- Optional Gemini API Key Drawer -->
        <div v-if="showSettings" class="settings-drawer fade-in">
          <div class="settings-inner">
            <div class="settings-title-row">
              <h4>🔑 Pengaturan Google Gemini API</h4>
              <span class="opt-tag">Opsional</span>
            </div>
            <p class="settings-desc">
              Masukkan Gemini API Key jika ingin mengaktifkan model LLM cloud Google Gemini. Jika dikosongkan, Chef AI otomatis menggunakan <strong>Intelligent Culinary Engine lokal</strong> kami (gratis &amp; tanpa internet luar).
            </p>
            <div class="api-key-form">
              <input
                v-model="apiKeyInput"
                type="password"
                placeholder="AIzaSy..."
                class="api-key-input"
              />
              <button class="btn btn-primary btn-sm save-key-btn" @click="handleSaveApiKey">
                {{ isApiKeySaved ? '✓ Tersimpan' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Body -->
        <div ref="messagesContainer" class="messages-body">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-row"
            :class="msg.sender"
          >
            <!-- Avatar for assistant -->
            <div v-if="msg.sender === 'assistant'" class="msg-avatar">
              <span>👨‍🍳</span>
            </div>

            <!-- Message Bubble -->
            <div class="msg-bubble-wrap">
              <div class="msg-bubble">
                <!-- Message HTML formatted text -->
                <div class="msg-text" v-html="formatMarkdown(msg.text)"></div>

                <!-- Matched Recipe Preview Card if exists -->
                <div v-if="msg.matchedRecipe" class="matched-recipe-card">
                  <div class="matched-card-media">
                    <img :src="msg.matchedRecipe.image" :alt="msg.matchedRecipe.title" />
                    <span class="matched-badge">⭐ {{ msg.matchedRecipe.rating }}</span>
                  </div>
                  <div class="matched-card-content">
                    <span class="matched-category">{{ msg.matchedRecipe.categoryName }}</span>
                    <h5 class="matched-title">{{ msg.matchedRecipe.title }}</h5>
                    <div class="matched-meta">
                      <span>⏱️ {{ msg.matchedRecipe.totalTimeMinutes }} mnt</span>
                      <span>•</span>
                      <span>👥 {{ msg.matchedRecipe.servings }} porsi</span>
                      <span>•</span>
                      <span>{{ msg.matchedRecipe.difficulty }}</span>
                    </div>
                    <button class="btn btn-primary btn-sm open-recipe-btn" @click="openRecipe(msg.matchedRecipe)">
                      Buka Resep Lengkap &rarr;
                    </button>
                  </div>
                </div>
              </div>

              <!-- Follow-up Suggestions Chips -->
              <div v-if="msg.suggestions && msg.suggestions.length > 0" class="suggestions-chips-row">
                <button
                  v-for="(sug, sIdx) in msg.suggestions"
                  :key="sIdx"
                  class="sug-chip"
                  @click="selectSuggestion(sug)"
                >
                  <span>💡</span> {{ sug }}
                </button>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="message-row assistant">
            <div class="msg-avatar">
              <span>👨‍🍳</span>
            </div>
            <div class="typing-bubble">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="typing-text">Chef AI sedang meracik ide masakan...</span>
            </div>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="window-footer">
          <form class="chat-input-form" @submit.prevent="handleSendMessage()">
            <input
              v-model="inputPrompt"
              type="text"
              placeholder="Tanya resep, bahan kulkas, atau tips..."
              class="chat-input-field"
              :disabled="isLoading"
              aria-label="Tanya ke Chef AI"
            />
            <button
              type="submit"
              class="send-btn"
              :disabled="!inputPrompt.trim() || isLoading"
              title="Kirim Pertanyaan"
            >
              <span>➔</span>
            </button>
          </form>
          <div class="footer-hint">
            <span>💡 Tips: Tuliskan bahan kulkas Anda, misal: <em>"Punya telur &amp; kecap"</em></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.chef-ai-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: var(--font-main);
}

/* Floating Action Button (FAB) */
.chef-ai-fab {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: linear-gradient(135deg, #d94814 0%, #b83609 100%);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 0.65rem 1.25rem 0.65rem 0.85rem;
  box-shadow: 0 8px 24px rgba(217, 72, 20, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chef-ai-fab:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 12px 28px rgba(217, 72, 20, 0.5);
}

.chef-ai-fab.fab-active {
  background: #24211d;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.fab-icon-wrap {
  position: relative;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab-chef-icon {
  font-size: 1.4rem;
}

.sparkle-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 0.75rem;
}

.fab-label-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  background-color: #4ade80;
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px #4ade80;
  animation: pulseGlow 1.8s infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.3); }
}

/* Chat Window */
.chef-ai-window {
  position: absolute;
  bottom: 74px;
  right: 0;
  width: 420px;
  height: 600px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 120px);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(35, 20, 10, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: chatOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes chatOpen {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.window-header {
  background: radial-gradient(circle at 10% 20%, #fff7ed 0%, #fdfbf7 100%);
  border-bottom: 1px solid var(--border-light);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-chef-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-ring {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-full);
  background: #ffffff;
  border: 2px solid var(--primary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.chef-avatar {
  font-size: 1.5rem;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border: 2px solid #ffffff;
  border-radius: var(--radius-full);
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.header-name-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.header-name-row h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.ai-badge {
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
}

.status-subtitle {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.ctrl-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  background: transparent;
  transition: all 0.2s ease;
}

.ctrl-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-main);
}

.ctrl-btn.active {
  background: var(--primary-light);
  color: var(--primary);
}

.close-btn {
  font-size: 1rem;
  font-weight: 700;
}

/* Settings Drawer */
.settings-drawer {
  background: #fdfaf6;
  border-bottom: 1px solid var(--border-light);
  padding: 1rem 1.25rem;
  animation: fadeIn 0.2s ease;
}

.settings-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.settings-title-row h4 {
  font-size: 0.88rem;
  color: var(--text-main);
}

.opt-tag {
  font-size: 0.7rem;
  background: #ede8e1;
  color: var(--text-muted);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.settings-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 0.75rem;
}

.api-key-form {
  display: flex;
  gap: 0.5rem;
}

.api-key-input {
  flex-grow: 1;
  border: 1px solid var(--border-light);
  background: #ffffff;
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
  outline: none;
}

.api-key-input:focus {
  border-color: var(--primary);
}

/* Messages Body */
.messages-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: var(--bg-subtle);
}

.message-row {
  display: flex;
  gap: 0.65rem;
  max-width: 90%;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-row.assistant {
  align-self: flex-start;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: #ffffff;
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.msg-bubble {
  padding: 0.85rem 1.1rem;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.55;
  box-shadow: var(--shadow-sm);
}

.message-row.user .msg-bubble {
  background: linear-gradient(135deg, #d94814 0%, #b83609 100%);
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.message-row.assistant .msg-bubble {
  background: #ffffff;
  border: 1px solid var(--border-light);
  color: var(--text-main);
  border-bottom-left-radius: 4px;
}

.msg-text :deep(strong) {
  color: var(--primary);
  font-weight: 700;
}

.message-row.user .msg-text :deep(strong) {
  color: #ffffff;
}

/* Matched Recipe Preview Card */
.matched-recipe-card {
  margin-top: 0.85rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.matched-card-media {
  position: relative;
  width: 100%;
  height: 110px;
}

.matched-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.matched-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 700;
}

.matched-card-content {
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.matched-category {
  font-size: 0.72rem;
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
}

.matched-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.matched-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-bottom: 0.4rem;
}

.open-recipe-btn {
  width: 100%;
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
}

/* Suggestions Chips */
.suggestions-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.sug-chip {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 0.35rem 0.75rem;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.sug-chip:hover {
  background: var(--primary-light);
  border-color: var(--primary-border);
  color: var(--primary);
  transform: translateY(-1px);
}

/* Typing Indicator */
.typing-bubble {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  animation: typingBounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-4px); opacity: 1; }
}

.typing-text {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Footer / Input Bar */
.window-footer {
  background: #ffffff;
  border-top: 1px solid var(--border-light);
  padding: 0.85rem 1.15rem;
}

.chat-input-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 0.3rem 0.4rem 0.3rem 1rem;
  transition: border-color 0.2s ease;
}

.chat-input-form:focus-within {
  border-color: var(--primary);
}

.chat-input-field {
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.88rem;
  color: var(--text-main);
  flex-grow: 1;
}

.send-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: transform 0.2s ease, background 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: scale(1.08);
}

.send-btn:disabled {
  background: #ddd5cb;
  cursor: not-allowed;
}

.footer-hint {
  margin-top: 0.4rem;
  font-size: 0.72rem;
  color: var(--text-light);
  text-align: center;
}

/* Transition */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@media (max-width: 480px) {
  .chef-ai-window {
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
    right: -12px;
    bottom: 64px;
  }
}
</style>
