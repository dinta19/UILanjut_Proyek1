<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  POPULAR_PANTRY_PRESETS,
  getSavedPantry,
  savePantry,
  matchRecipesWithPantry,
  type RecipeMatchResult
} from '../services/pantryService'
import CookingModeModal from '../components/recipes/CookingModeModal.vue'
import type { Recipe } from '../types/recipe'

// User's selected ingredients in pantry
const selectedIngredients = ref<string[]>([])
const customInput = ref('')
const activeCategoryFilter = ref<string>('all')
const matchFilter = ref<'all' | 'ready' | 'high'>('all')

// Cooking mode modal trigger
const activeCookingRecipe = ref<Recipe | null>(null)

onMounted(() => {
  selectedIngredients.value = getSavedPantry()
})

const saveCurrentPantry = () => {
  savePantry(selectedIngredients.value)
}

// Toggle an ingredient
const toggleIngredient = (name: string) => {
  const index = selectedIngredients.value.findIndex(
    (item) => item.toLowerCase() === name.toLowerCase()
  )
  if (index > -1) {
    selectedIngredients.value.splice(index, 1)
  } else {
    selectedIngredients.value.push(name)
  }
  saveCurrentPantry()
}

const isSelected = (name: string) => {
  return selectedIngredients.value.some(
    (item) => item.toLowerCase() === name.toLowerCase()
  )
}

// Add custom ingredient from text input
const addCustomIngredient = () => {
  const trimmed = customInput.value.trim()
  if (!trimmed) return
  if (!isSelected(trimmed)) {
    selectedIngredients.value.push(trimmed)
    saveCurrentPantry()
  }
  customInput.value = ''
}

const removeIngredient = (name: string) => {
  selectedIngredients.value = selectedIngredients.value.filter(
    (item) => item.toLowerCase() !== name.toLowerCase()
  )
  saveCurrentPantry()
}

const clearAllIngredients = () => {
  selectedIngredients.value = []
  saveCurrentPantry()
}

// Filter presets by category
const displayedPresets = computed(() => {
  if (activeCategoryFilter.value === 'all') {
    return POPULAR_PANTRY_PRESETS
  }
  return POPULAR_PANTRY_PRESETS.filter(
    (preset) => preset.category === activeCategoryFilter.value
  )
})

// Match results computed in real time
const matchResults = computed<RecipeMatchResult[]>(() => {
  return matchRecipesWithPantry(selectedIngredients.value)
})

// Filtered match results by readiness
const filteredResults = computed(() => {
  if (matchFilter.value === 'ready') {
    return matchResults.value.filter((res) => res.isReadyToCook)
  }
  if (matchFilter.value === 'high') {
    return matchResults.value.filter((res) => res.matchPercentage >= 50)
  }
  return matchResults.value
})

const readyToCookCount = computed(() => {
  return matchResults.value.filter((res) => res.isReadyToCook).length
})

const openCookingMode = (recipe: Recipe) => {
  activeCookingRecipe.value = recipe
}

const closeCookingMode = () => {
  activeCookingRecipe.value = null
}
</script>

<template>
  <div class="pantry-view-page container fade-in">
    <!-- Academic Novelty Banner / Hero Header -->
    <header class="pantry-hero">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        <span>Algoritma Pencocokan Bahan &amp; Jaccard Similarity</span>
      </div>
      <h1 class="pantry-title">Smart Pantry: "Apa Isi Kulkasmu Hari Ini?"</h1>
      <p class="pantry-subtitle">
        Pilih atau masukkan bahan makanan yang tersedia di dapurmu. Sistem akan secara cerdas
        menghitung koefisien kesamaan bahan dan merekomendasikan resep yang siap kamu eksekusi
        tanpa perlu repot belanja banyak!
      </p>
    </header>

    <!-- Main Pantry Setup Section -->
    <div class="pantry-workspace-grid">
      <!-- Left Column: Pantry Inventory Controller -->
      <section class="pantry-input-card">
        <div class="card-header-row">
          <div class="title-with-count">
            <h2>Koleksi Bahan Kulkas</h2>
            <span class="count-pill">{{ selectedIngredients.length }} Bahan Terpilih</span>
          </div>
          <button
            v-if="selectedIngredients.length > 0"
            class="btn-clear-pantry"
            @click="clearAllIngredients"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trash-svg">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Kosongkan</span>
          </button>
        </div>

        <!-- Custom Input Field -->
        <form class="custom-input-form" @submit.prevent="addCustomIngredient">
          <input
            v-model="customInput"
            type="text"
            class="input-ingredient"
            placeholder="Ketik bahan lain... (contoh: Jamur, Kornet, Daun Jeruk)"
          />
          <button type="submit" class="btn-add-ingredient">
            + Tambah
          </button>
        </form>

        <!-- Category Filter Tabs -->
        <div class="category-tabs">
          <button
            class="cat-tab-btn"
            :class="{ active: activeCategoryFilter === 'all' }"
            @click="activeCategoryFilter = 'all'"
          >
            Semua
          </button>
          <button
            class="cat-tab-btn"
            :class="{ active: activeCategoryFilter === 'protein' }"
            @click="activeCategoryFilter = 'protein'"
          >
            🥩 Protein
          </button>
          <button
            class="cat-tab-btn"
            :class="{ active: activeCategoryFilter === 'bumbu' }"
            @click="activeCategoryFilter = 'bumbu'"
          >
            🧅 Bumbu
          </button>
          <button
            class="cat-tab-btn"
            :class="{ active: activeCategoryFilter === 'karbo' }"
            @click="activeCategoryFilter = 'karbo'"
          >
            🍚 Karbohidrat
          </button>
          <button
            class="cat-tab-btn"
            :class="{ active: activeCategoryFilter === 'sayur' }"
            @click="activeCategoryFilter = 'sayur'"
          >
            🥦 Sayuran
          </button>
          <button
            class="cat-tab-btn"
            :class="{ active: activeCategoryFilter === 'pelengkap' }"
            @click="activeCategoryFilter = 'pelengkap'"
          >
            🧈 Pelengkap
          </button>
        </div>

        <!-- Quick Pick Chips Grid -->
        <div class="preset-chips-grid">
          <button
            v-for="preset in displayedPresets"
            :key="preset.id"
            class="preset-chip"
            :class="{ selected: isSelected(preset.name) }"
            @click="toggleIngredient(preset.name)"
          >
            <span class="preset-icon">{{ preset.icon }}</span>
            <span class="preset-name">{{ preset.name }}</span>
            <span class="preset-state">{{ isSelected(preset.name) ? '✓' : '+' }}</span>
          </button>
        </div>

        <!-- Active Selected Tag Cloud -->
        <div v-if="selectedIngredients.length > 0" class="selected-tags-container">
          <span class="tags-heading">Bahan yang tersimpan di kulkas Anda:</span>
          <div class="tags-cloud">
            <span
              v-for="ing in selectedIngredients"
              :key="ing"
              class="active-tag-pill"
            >
              <span>{{ ing }}</span>
              <button
                class="btn-remove-tag"
                @click="removeIngredient(ing)"
                title="Hapus bahan"
              >
                ✕
              </button>
            </span>
          </div>
        </div>

        <!-- Algorithm Info Card for Thesis Presentation -->
        <div class="algo-explanation-box">
          <div class="algo-title">
            <span>📐 Nilai Ilmiah / Formula TA</span>
          </div>
          <p class="algo-text">
            Sistem menggunakan formula <strong>Jaccard Similarity Index</strong>
            <code>J(A, B) = |A ∩ B| / |A ∪ B|</code> untuk mengukur relevansi, dipadukan dengan
            <strong>Recipe Fulfillment Coverage</strong> untuk memprioritaskan resep dengan bahan paling lengkap.
          </p>
        </div>
      </section>

      <!-- Right Column: Matching Recipes Results -->
      <section class="pantry-results-area">
        <div class="results-header-bar">
          <div>
            <h2>Hasil Rekomendasi Menu</h2>
            <p class="results-sub">
              Ditemukan <strong>{{ filteredResults.length }}</strong> resep yang cocok dengan bahan kulkasmu
            </p>
          </div>

          <!-- Filter Pills -->
          <div class="filter-pills-group">
            <button
              class="filter-pill-btn"
              :class="{ active: matchFilter === 'all' }"
              @click="matchFilter = 'all'"
            >
              Semua ({{ matchResults.length }})
            </button>
            <button
              class="filter-pill-btn highlight"
              :class="{ active: matchFilter === 'ready' }"
              @click="matchFilter = 'ready'"
            >
              <span>Siap Masak 100% ({{ readyToCookCount }})</span>
            </button>
            <button
              class="filter-pill-btn"
              :class="{ active: matchFilter === 'high' }"
              @click="matchFilter = 'high'"
            >
              <span>&ge; 50% Bahan Ada</span>
            </button>
          </div>
        </div>

        <!-- Empty State if no recipes match filter -->
        <div v-if="filteredResults.length === 0" class="empty-results-box">
          <div class="empty-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-svg">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
              <line x1="6" y1="17" x2="18" y2="17"/>
            </svg>
          </div>
          <h3>Belum Ada Resep yang Cocok</h3>
          <p>
            Coba tambahkan beberapa bahan pokok populer seperti <strong>Telur</strong>,
            <strong>Bawang Merah</strong>, atau <strong>Nasi</strong> untuk melihat rekomendasi!
          </p>
        </div>

        <!-- Recipe Match Cards List -->
        <div v-else class="match-cards-list">
          <div
            v-for="item in filteredResults"
            :key="item.recipe.id"
            class="match-recipe-card"
            :class="{ 'card-ready': item.isReadyToCook }"
          >
            <div class="card-media-col">
              <img :src="item.recipe.image" :alt="item.recipe.title" class="match-card-thumb" />
              <div
                class="match-badge"
                :class="{
                  'badge-full': item.matchPercentage === 100,
                  'badge-high': item.matchPercentage >= 60 && item.matchPercentage < 100,
                  'badge-med': item.matchPercentage < 60
                }"
              >
                <span class="badge-pct">{{ item.matchPercentage }}%</span>
                <span class="badge-text">{{ item.isReadyToCook ? 'Siap Masak' : 'Bahan Cocok' }}</span>
              </div>
            </div>

            <div class="card-info-col">
              <div class="card-top-row">
                <span class="cat-pill">{{ item.recipe.categoryName }}</span>
                <span class="jaccard-metric-tag" title="Koefisien Jaccard Similarity (0 s/d 1.0)">
                  Jaccard: <strong>{{ item.jaccardSimilarity }}</strong>
                </span>
                <span class="time-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="meta-inline-svg">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{{ item.recipe.totalTimeMinutes }} mnt</span>
                </span>
              </div>

              <h3 class="card-recipe-title">
                <RouterLink :to="`/recipes/${item.recipe.id}`">
                  {{ item.recipe.title }}
                </RouterLink>
              </h3>

              <p class="card-recipe-desc">{{ item.recipe.description }}</p>

              <!-- Ingredient Match Breakdown Badges -->
              <div class="ingredients-breakdown-box">
                <div v-if="item.matchedIngredients.length > 0" class="breakdown-group matched">
                  <span class="breakdown-label">✓ Tersedia di Kulkas ({{ item.matchedIngredients.length }}):</span>
                  <div class="breakdown-chips">
                    <span
                      v-for="ing in item.matchedIngredients.slice(0, 5)"
                      :key="ing"
                      class="chip-ing available"
                    >
                      {{ ing }}
                    </span>
                    <span v-if="item.matchedIngredients.length > 5" class="chip-ing more">
                      +{{ item.matchedIngredients.length - 5 }} lainnya
                    </span>
                  </div>
                </div>

                <div v-if="item.missingIngredients.length > 0" class="breakdown-group missing">
                  <span class="breakdown-label">✕ Perlu Beli Tambahan ({{ item.missingIngredients.length }}):</span>
                  <div class="breakdown-chips">
                    <span
                      v-for="ing in item.missingIngredients.slice(0, 4)"
                      :key="ing"
                      class="chip-ing lacking"
                    >
                      {{ ing }}
                    </span>
                    <span v-if="item.missingIngredients.length > 4" class="chip-ing more">
                      +{{ item.missingIngredients.length - 4 }} lainnya
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Action Buttons -->
              <div class="card-footer-actions">
                <RouterLink :to="`/recipes/${item.recipe.id}`" class="btn-detail-link">
                  Lihat Resep Lengkap
                </RouterLink>

                <button
                  class="btn-handsfree-action"
                  @click="openCookingMode(item.recipe)"
                  title="Langsung mulai masak dengan asisten suara hands-free"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-mic-svg">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                  <span>Mode Masak Hands-Free</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Hands-Free Voice Assistant Cooking Modal -->
    <CookingModeModal
      v-if="activeCookingRecipe"
      :recipe="activeCookingRecipe"
      @close="closeCookingMode"
    />
  </div>
</template>

<style scoped>
.pantry-view-page {
  padding-top: 2rem;
  padding-bottom: 5rem;
}

/* Hero */
.pantry-hero {
  text-align: center;
  max-width: 860px;
  margin: 0 auto 3rem auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  padding: 0.4rem 1.1rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.pantry-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.pantry-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Workspace Layout */
.pantry-workspace-grid {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* Left Column */
.pantry-input-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 90px;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-with-count {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.title-with-count h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.count-pill {
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
}

.btn-clear-pantry {
  font-size: 0.82rem;
  color: #dc2626;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.trash-svg {
  width: 14px;
  height: 14px;
}

.btn-clear-pantry:hover {
  text-decoration: underline;
}

/* Custom Input */
.custom-input-form {
  display: flex;
  gap: 0.5rem;
}

.input-ingredient {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  background: var(--bg-subtle);
  color: var(--text-main);
  outline: none;
  transition: all 0.2s;
}

.input-ingredient:focus {
  border-color: var(--primary);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(217, 72, 20, 0.1);
}

.btn-add-ingredient {
  padding: 0.75rem 1.25rem;
  background: var(--primary);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: var(--radius-md);
  white-space: nowrap;
}

.btn-add-ingredient:hover {
  background: var(--primary-hover);
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.cat-tab-btn {
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--bg-subtle);
  color: var(--text-muted);
  white-space: nowrap;
  border: 1px solid transparent;
}

.cat-tab-btn.active {
  background: var(--text-main);
  color: white;
}

/* Preset Chips */
.preset-chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-main);
  transition: all 0.2s;
}

.preset-chip:hover {
  border-color: var(--primary-border);
  background: var(--primary-light);
}

.preset-chip.selected {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 700;
}

.preset-state {
  font-size: 0.75rem;
  font-weight: 800;
  margin-left: 0.15rem;
}

/* Active tag cloud */
.selected-tags-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-light);
}

.tags-heading {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.active-tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
}

.btn-remove-tag {
  color: #047857;
  font-size: 0.75rem;
  font-weight: 800;
}

.btn-remove-tag:hover {
  color: #b91c1c;
}

/* Algo Box */
.algo-explanation-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md);
  padding: 1rem;
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.5;
}

.algo-title {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.algo-explanation-box code {
  background: #e2e8f0;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  color: #0f172a;
  font-weight: 600;
}

/* Right Column: Results */
.pantry-results-area {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.results-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.results-header-bar h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
}

.results-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.filter-pills-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-pill-btn {
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 600;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
}

.filter-pill-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.filter-pill-btn.highlight.active {
  background: #16a34a;
  border-color: #16a34a;
}

/* Match Recipe Cards */
.match-cards-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-recipe-card {
  display: grid;
  grid-template-columns: 240px 1fr;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.match-recipe-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-border);
}

.match-recipe-card.card-ready {
  border: 2px solid #22c55e;
}

.card-media-col {
  position: relative;
  height: 100%;
  min-height: 200px;
}

.match-card-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.match-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.match-badge.badge-full {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.match-badge.badge-high {
  background: linear-gradient(135deg, #ea580c, #c2410c);
}

.match-badge.badge-med {
  background: linear-gradient(135deg, #64748b, #475569);
}

.badge-pct {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1;
}

.badge-text {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-info-col {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.card-top-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cat-pill {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-light);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.jaccard-metric-tag {
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #334155;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1px solid #cbd5e1;
}

.time-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.meta-inline-svg {
  width: 14px;
  height: 14px;
  color: var(--text-light);
}

.card-recipe-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.3;
}

.card-recipe-title a:hover {
  color: var(--primary);
}

.card-recipe-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Breakdown */
.ingredients-breakdown-box {
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.breakdown-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.breakdown-label {
  font-size: 0.75rem;
  font-weight: 700;
}

.breakdown-group.matched .breakdown-label {
  color: #15803d;
}

.breakdown-group.missing .breakdown-label {
  color: #b91c1c;
}

.breakdown-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.chip-ing {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.chip-ing.available {
  background: #dcfce7;
  color: #166534;
}

.chip-ing.lacking {
  background: #fee2e2;
  color: #991b1b;
}

.chip-ing.more {
  background: var(--border-light);
  color: var(--text-muted);
}

/* Card Actions */
.card-footer-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.5rem;
  flex-wrap: wrap;
}

.btn-detail-link {
  padding: 0.55rem 1.15rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  transition: all 0.2s;
}

.btn-detail-link:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary-border);
}

.btn-handsfree-action {
  padding: 0.55rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #c2410c, #9a3412);
  box-shadow: 0 2px 8px rgba(194, 65, 12, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.btn-mic-svg {
  width: 15px;
  height: 15px;
}

.btn-handsfree-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(194, 65, 12, 0.35);
}

/* Empty box */
.empty-results-box {
  background: var(--bg-surface);
  border: 1px dashed var(--border-light);
  border-radius: var(--radius-lg);
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem auto;
}

.empty-svg {
  width: 28px;
  height: 28px;
}

.empty-results-box h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

@media (max-width: 980px) {
  .pantry-workspace-grid {
    grid-template-columns: 1fr;
  }

  .pantry-input-card {
    position: static;
  }

  .match-recipe-card {
    grid-template-columns: 1fr;
  }

  .card-media-col {
    height: 200px;
  }
}
</style>
