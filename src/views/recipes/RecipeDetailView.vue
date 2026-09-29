<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { recipesData } from '../../data/recipesData'
import Breadcrumb from '../../components/common/Breadcrumb.vue'
import RecipeCard from '../../components/recipes/RecipeCard.vue'
import CookingModeModal from '../../components/recipes/CookingModeModal.vue'
import { useFavorites } from '../../composables/useFavorites'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggleFavorite } = useFavorites()

// Cooking Mode Hands-Free State
const isCookingModeOpen = ref(false)
const activeCookingStepIndex = ref(0)

const startCookingMode = (stepIndex = 0) => {
  activeCookingStepIndex.value = stepIndex
  isCookingModeOpen.value = true
}

// Find current recipe by ID or slug
const recipe = computed(() => {
  const param = route.params.id as string
  return recipesData.find((r) => r.id === param || r.slug === param)
})

// Servings adjuster
const baseServings = computed(() => recipe.value?.servings || 4)
const currentServings = ref<number>(4)

// Sync servings when recipe loads
if (recipe.value) {
  currentServings.value = recipe.value.servings
}

const increaseServings = () => {
  if (currentServings.value < 20) {
    currentServings.value++
  }
}

const decreaseServings = () => {
  if (currentServings.value > 1) {
    currentServings.value--
  }
}

// Dynamic ingredient scaling
const scaledIngredients = computed(() => {
  if (!recipe.value) return []
  const factor = currentServings.value / baseServings.value

  return recipe.value.ingredients.map((ing) => {
    const rawScaled = ing.amount * factor
    // Format nicely (e.g. 1.5, 2, etc.)
    const formattedAmount = Math.round(rawScaled * 10) / 10
    return {
      ...ing,
      scaledAmount: formattedAmount
    }
  })
})

// Checked ingredients and steps
const checkedIngredients = ref<Record<number, boolean>>({})
const completedSteps = ref<Record<number, boolean>>({})

const toggleIngredientCheck = (index: number) => {
  checkedIngredients.value[index] = !checkedIngredients.value[index]
}

const toggleStepCompleted = (stepNumber: number) => {
  completedSteps.value[stepNumber] = !completedSteps.value[stepNumber]
}

// Copy link notification
const copyLinkSuccess = ref(false)
const shareRecipe = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copyLinkSuccess.value = true
    setTimeout(() => {
      copyLinkSuccess.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

// Related recipes
const relatedRecipes = computed(() => {
  if (!recipe.value) return []
  return recipesData
    .filter((r) => r.categorySlug === recipe.value?.categorySlug && r.id !== recipe.value?.id)
    .slice(0, 3)
})

// Breadcrumbs
const breadcrumbs = computed(() => {
  if (!recipe.value) {
    return [{ label: 'Jelajah Resep', to: '/recipes' }, { label: 'Resep Tidak Ditemukan' }]
  }
  return [
    { label: 'Jelajah Resep', to: '/recipes' },
    { label: recipe.value.title }
  ]
})

const goBackToCatalog = () => {
  router.push('/recipes')
}
</script>

<template>
  <div v-if="recipe" class="recipe-detail-page container fade-in">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Navigation Bar -->
    <div class="detail-top-nav">
      <button class="back-link-btn" @click="goBackToCatalog">
        <span>&larr;</span> Kembali ke Katalog Resep
      </button>

      <div class="top-action-group">
        <button
          class="btn-action-pill btn-handsfree-trigger"
          @click="startCookingMode(0)"
          title="Mulai memasak dengan perintah suara tanpa sentuh layar"
        >
          <span>🎙️ Mode Masak Hands-Free</span>
        </button>

        <button
          class="btn-action-pill"
          :class="{ 'fav-active': isFavorite(recipe.id) }"
          @click="toggleFavorite(recipe.id)"
        >
          <span>{{ isFavorite(recipe.id) ? '❤️ Tersimpan di Favorit' : '🤍 Tambah ke Favorit' }}</span>
        </button>

        <button class="btn-action-pill" @click="shareRecipe">
          <span>🔗 {{ copyLinkSuccess ? 'Tautan Disalin!' : 'Bagikan' }}</span>
        </button>
      </div>
    </div>

    <!-- Header Section -->
    <div class="recipe-hero-header">
      <div class="header-tags">
        <!-- Clickable Category Badge (Child -> Parent-Child Cross-link) -->
        <RouterLink :to="`/categories/${recipe.categorySlug}`" class="category-link-tag">
          🏷️ {{ recipe.categoryName }}
        </RouterLink>

        <span class="difficulty-tag" :class="`badge-difficulty-${recipe.difficulty.toLowerCase()}`">
          {{ recipe.difficulty }}
        </span>

        <span class="origin-tag">📍 {{ recipe.origin }}</span>
      </div>

      <h1 class="detail-title">{{ recipe.title }}</h1>
      <p class="detail-desc">{{ recipe.description }}</p>

      <div class="chef-credit">
        <span class="chef-avatar">👨‍🍳</span>
        <span>Resep dikurasi oleh <strong>{{ recipe.chefName }}</strong></span>
        <span class="dot">•</span>
        <span class="rating-highlight">⭐ {{ recipe.rating }} ({{ recipe.reviewsCount }} ulasan)</span>
      </div>
    </div>

    <!-- Visual Media & Fast Stats -->
    <div class="media-stats-grid">
      <div class="main-image-wrapper">
        <img :src="recipe.image" :alt="recipe.title" class="detail-hero-image" />
      </div>

      <div class="stats-sidebar-card">
        <h3 class="stats-title">Ringkasan Memasak</h3>

        <div class="stat-row">
          <div class="stat-icon-wrap">⏱️</div>
          <div class="stat-text">
            <span class="stat-label">Total Waktu</span>
            <span class="stat-val">{{ recipe.totalTimeMinutes }} Menit</span>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-icon-wrap">🥣</div>
          <div class="stat-text">
            <span class="stat-label">Persiapan Bahan</span>
            <span class="stat-val">{{ recipe.prepTimeMinutes }} Menit</span>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-icon-wrap">🍳</div>
          <div class="stat-text">
            <span class="stat-label">Durasi Memasak</span>
            <span class="stat-val">{{ recipe.cookTimeMinutes }} Menit</span>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-icon-wrap">🔥</div>
          <div class="stat-text">
            <span class="stat-label">Estimasi Energi</span>
            <span class="stat-val">{{ recipe.caloriesPerServing }} kkal / porsi</span>
          </div>
        </div>

        <!-- Serving Scaler in Stats -->
        <div class="servings-controller">
          <span class="serving-label">Sesuaikan Porsi:</span>
          <div class="servings-stepper">
            <button
              class="stepper-btn"
              @click="decreaseServings"
              :disabled="currentServings <= 1"
              title="Kurangi porsi"
            >
              -
            </button>
            <span class="serving-number">{{ currentServings }} Orang</span>
            <button
              class="stepper-btn"
              @click="increaseServings"
              :disabled="currentServings >= 20"
              title="Tambah porsi"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cooking Content Grid (Ingredients & Steps) -->
    <div class="cooking-content-grid">
      <!-- Left Column: Ingredients Checklist -->
      <section class="ingredients-column">
        <div class="ingredients-card">
          <div class="section-title-row">
            <h2>Bahan-Bahan</h2>
            <span class="serving-indicator">Untuk {{ currentServings }} Porsi</span>
          </div>
          <p class="checklist-hint">
            💡 Centang bahan yang sudah siap di meja dapur Anda:
          </p>

          <ul class="ingredients-checklist">
            <li
              v-for="(ing, idx) in scaledIngredients"
              :key="idx"
              class="ingredient-item"
              :class="{ checked: checkedIngredients[idx] }"
              @click="toggleIngredientCheck(idx)"
            >
              <div class="check-box" :class="{ active: checkedIngredients[idx] }">
                <span v-if="checkedIngredients[idx]">✓</span>
              </div>
              <div class="ingredient-info">
                <span class="ingredient-name">{{ ing.name }}</span>
                <span class="ingredient-measure">{{ ing.scaledAmount }} {{ ing.unit }}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Right Column: Step by Step Instructions -->
      <section class="steps-column">
        <div class="steps-card">
          <div class="section-title-row">
            <h2>Langkah-Langkah Memasak</h2>
            <span class="steps-total">{{ recipe.steps.length }} Tahapan</span>
          </div>

          <!-- Inovasi TA: Hands-Free Cooking Mode Callout -->
          <div class="handsfree-banner-callout">
            <div class="callout-icon-wrap">🎙️</div>
            <div class="callout-text-wrap">
              <h4>Mode Asisten Suara (Hands-Free)</h4>
              <p>Tangan kotor atau basah saat memasak? Aktifkan mode suara untuk navigasi resep tanpa sentuh layar!</p>
            </div>
            <button class="btn-start-handsfree" @click="startCookingMode(0)">
              Mulai Memasak
            </button>
          </div>

          <div class="steps-timeline">
            <div
              v-for="step in recipe.steps"
              :key="step.stepNumber"
              class="step-block"
              :class="{ completed: completedSteps[step.stepNumber] }"
            >
              <div class="step-badge-wrap">
                <span class="step-num">{{ step.stepNumber }}</span>
              </div>

              <div class="step-body">
                <div class="step-header">
                  <h3 class="step-title">{{ step.title }}</h3>
                  <div class="step-meta">
                    <span v-if="step.durationMinutes" class="step-time">
                      ⏱️ ~{{ step.durationMinutes }} menit
                    </span>
                    <button
                      class="step-check-btn"
                      :class="{ active: completedSteps[step.stepNumber] }"
                      @click="toggleStepCompleted(step.stepNumber)"
                    >
                      {{ completedSteps[step.stepNumber] ? '✓ Selesai' : 'Tandai Selesai' }}
                    </button>
                  </div>
                </div>

                <p class="step-instruction">{{ step.instruction }}</p>

                <!-- Tip box inside step -->
                <div v-if="step.tip" class="step-tip-callout">
                  <span class="tip-star">💡 Tips:</span> {{ step.tip }}
                </div>
              </div>
            </div>
          </div>

          <!-- Chef's Extra Tips -->
          <div v-if="recipe.tips && recipe.tips.length > 0" class="chef-notes-box">
            <h3>👨‍🍳 Catatan Rahasia Dapur Chef</h3>
            <ul>
              <li v-for="(tip, tIdx) in recipe.tips" :key="tIdx">
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- Related Recipes Section -->
    <section v-if="relatedRecipes.length > 0" class="related-section">
      <div class="section-header">
        <div>
          <span class="section-kicker">Eksplorasi Lainnya</span>
          <h2 class="section-title">Resep Serupa dalam Kategori {{ recipe.categoryName }}</h2>
        </div>
        <RouterLink :to="`/categories/${recipe.categorySlug}`" class="btn btn-secondary btn-sm">
          Lihat Kategori Lengkap &rarr;
        </RouterLink>
      </div>

      <div class="grid-recipes">
        <RecipeCard
          v-for="relRecipe in relatedRecipes"
          :key="relRecipe.id"
          :recipe="relRecipe"
        />
      </div>
    </section>

    <!-- Inovasi TA: Hands-Free Voice Assistant Cooking Modal -->
    <CookingModeModal
      v-if="isCookingModeOpen"
      :recipe="recipe"
      :initial-step-index="activeCookingStepIndex"
      @close="isCookingModeOpen = false"
    />
  </div>

  <!-- Not Found State -->
  <div v-else class="container empty-state-box not-found-recipe">
    <div class="empty-icon">🔍</div>
    <h2>Resep Tidak Ditemukan</h2>
    <p>Resep masakan yang Anda cari mungkin telah dipindahkan atau tautan tidak valid.</p>
    <RouterLink to="/recipes" class="btn btn-primary">
      Kembali ke Katalog Resep
    </RouterLink>
  </div>
</template>

<style scoped>
.recipe-detail-page {
  padding-bottom: 5rem;
}

/* Top Navigation Bar */
.detail-top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 0.55rem 1rem;
  border-radius: var(--radius-full);
}

.back-link-btn:hover {
  color: var(--primary);
  border-color: var(--primary-border);
  transform: translateX(-3px);
}

.top-action-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-action-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 0.55rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
}

.btn-action-pill:hover {
  border-color: var(--primary-border);
  color: var(--primary);
}

.btn-action-pill.btn-handsfree-trigger {
  background: linear-gradient(135deg, #ea580c, #c2410c);
  color: white;
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(234, 88, 12, 0.3);
  font-weight: 700;
}

.btn-action-pill.btn-handsfree-trigger:hover {
  background: linear-gradient(135deg, #c2410c, #9a3412);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(234, 88, 12, 0.4);
}

.btn-action-pill.fav-active {
  background-color: var(--primary-light);
  border-color: var(--primary-border);
  color: var(--primary);
}

/* Header */
.recipe-hero-header {
  margin-bottom: 2rem;
}

.header-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.category-link-tag {
  background-color: var(--primary-light);
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.category-link-tag:hover {
  background-color: var(--primary);
  color: white;
}

.difficulty-tag {
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
}

.origin-tag {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
}

.detail-title {
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 0.85rem;
}

.detail-desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 820px;
  margin-bottom: 1.25rem;
}

.chef-credit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.chef-avatar {
  font-size: 1.2rem;
}

.dot {
  color: var(--text-light);
}

.rating-highlight {
  font-weight: 700;
  color: #b45309;
}

/* Media & Stats Grid */
.media-stats-grid {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.main-image-wrapper {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  height: 380px;
  background-color: #f3efe8;
}

.detail-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stats-sidebar-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stats-title {
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.75rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.1rem;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-light);
  font-weight: 600;
  text-transform: uppercase;
}

.stat-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
}

/* Servings Controller */
.servings-controller {
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.serving-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary);
}

.servings-stepper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffffff;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.stepper-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--bg-subtle);
  color: var(--text-main);
  font-weight: 800;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.stepper-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.serving-number {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--text-main);
  min-width: 60px;
  text-align: center;
}

/* Cooking Content Grid */
.cooking-content-grid {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 2.5rem;
  margin-bottom: 4rem;
}

/* Ingredients */
.ingredients-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 90px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.section-title-row h2 {
  font-size: 1.4rem;
}

.serving-indicator {
  font-size: 0.8rem;
  background: var(--bg-subtle);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  font-weight: 600;
}

.checklist-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.ingredients-checklist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ingredient-item:hover {
  background: #fdf6f0;
  border-color: var(--primary-border);
}

.ingredient-item.checked {
  opacity: 0.5;
  background: #f1ede6;
}

.ingredient-item.checked .ingredient-name {
  text-decoration: line-through;
}

.check-box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--border-light);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  color: white;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.check-box.active {
  background: var(--accent-green);
  border-color: var(--accent-green);
}

.ingredient-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.ingredient-name {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-main);
}

.ingredient-measure {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
}

/* Steps */
.steps-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2.25rem;
  box-shadow: var(--shadow-sm);
}

.steps-total {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Hands-Free Banner Callout */
.handsfree-banner-callout {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border: 1.5px solid #fed7aa;
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  margin-top: 1.25rem;
  margin-bottom: 1.5rem;
}

.callout-icon-wrap {
  font-size: 2.2rem;
  line-height: 1;
  flex-shrink: 0;
}

.callout-text-wrap {
  flex-grow: 1;
}

.callout-text-wrap h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #9a3412;
  margin-bottom: 0.25rem;
}

.callout-text-wrap p {
  font-size: 0.85rem;
  color: #7c2d12;
  line-height: 1.4;
  margin: 0;
}

.btn-start-handsfree {
  padding: 0.75rem 1.4rem;
  border-radius: var(--radius-full);
  background: #ea580c;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-start-handsfree:hover {
  background: #c2410c;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(234, 88, 12, 0.4);
}

.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-top: 1.5rem;
}

.step-block {
  display: flex;
  gap: 1.25rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px dashed var(--border-light);
  transition: opacity 0.25s ease;
}

.step-block:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.step-block.completed {
  opacity: 0.65;
}

.step-badge-wrap {
  flex-shrink: 0;
}

.step-num {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.step-block.completed .step-num {
  background: var(--accent-green);
}

.step-body {
  flex-grow: 1;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.65rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.step-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-time {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 600;
}

.step-check-btn {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  border: 1px solid var(--border-light);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
}

.step-check-btn:hover {
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.step-check-btn.active {
  background: var(--accent-green-light);
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.step-instruction {
  font-size: 0.96rem;
  color: var(--text-main);
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.step-tip-callout {
  background: #fefce8;
  border-left: 3px solid #eab308;
  padding: 0.65rem 1rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.88rem;
  color: #854d0e;
  line-height: 1.5;
}

.tip-star {
  font-weight: 700;
}

/* Chef's Notes Box */
.chef-notes-box {
  margin-top: 2rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.chef-notes-box h3 {
  font-size: 1.05rem;
  margin-bottom: 0.75rem;
  color: var(--primary);
}

.chef-notes-box ul {
  padding-left: 1.25rem;
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.chef-notes-box li {
  margin-bottom: 0.4rem;
}

/* Related */
.related-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-light);
}

@media (max-width: 992px) {
  .media-stats-grid,
  .cooking-content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .ingredients-card {
    position: static;
  }

  .main-image-wrapper {
    height: 300px;
  }
}

@media (max-width: 600px) {
  .detail-title {
    font-size: 1.9rem;
  }

  .detail-top-nav {
    flex-direction: column;
    align-items: stretch;
  }

  .top-action-group {
    justify-content: space-between;
  }
}
</style>
