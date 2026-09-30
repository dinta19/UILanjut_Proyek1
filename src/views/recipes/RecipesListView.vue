<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recipesData, categoriesData } from '../../data/recipesData'
import Breadcrumb from '../../components/common/Breadcrumb.vue'
import RecipeCard from '../../components/recipes/RecipeCard.vue'

const route = useRoute()
const router = useRouter()

// Breadcrumb items
const breadcrumbs = [
  { label: 'Jelajah Resep' }
]

// Filter states
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedDifficulty = ref('all')
const sortBy = ref('featured')

// Sync with route queries
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }
  if (route.query.category) {
    selectedCategory.value = String(route.query.category)
  }
})

// Update URL query when filters change
watch([searchQuery, selectedCategory], ([newQuery, newCat]) => {
  const query: Record<string, string> = {}
  if (newQuery) query.q = newQuery
  if (newCat && newCat !== 'all') query.category = newCat

  router.replace({ query })
})

// Filtered and Sorted Recipes
const filteredRecipes = computed(() => {
  return recipesData
    .filter((recipe) => {
      // Search filter
      const matchesSearch =
        !searchQuery.value ||
        recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        recipe.categoryName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        recipe.origin.toLowerCase().includes(searchQuery.value.toLowerCase())

      // Category filter
      const matchesCategory =
        selectedCategory.value === 'all' || recipe.categorySlug === selectedCategory.value

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty.value === 'all' || recipe.difficulty === selectedDifficulty.value

      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      if (sortBy.value === 'rating') {
        return b.rating - a.rating
      } else if (sortBy.value === 'time-asc') {
        return a.totalTimeMinutes - b.totalTimeMinutes
      } else if (sortBy.value === 'calories-asc') {
        return a.caloriesPerServing - b.caloriesPerServing
      }
      // default: featured or title
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedDifficulty.value = 'all'
  sortBy.value = 'featured'
}
</script>

<template>
  <div class="recipes-list-page container">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Katalog &amp; Jelajah Resep</h1>
        <p class="page-subtitle">
          Temukan inspirasi masakan harian dengan takaran bahan yang pas dan instruksi memasak terpercaya.
        </p>
      </div>

      <div class="recipes-count-badge">
        <span class="count-num">{{ filteredRecipes.length }}</span>
        <span class="count-text">Resep Tersedia</span>
      </div>
    </div>

    <!-- Filter & Controls Toolbar -->
    <div class="filter-toolbar">
      <!-- Search Input -->
      <div class="search-field">
        <svg class="field-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari masakan, bahan, atau daerah asal..."
          class="filter-input"
          aria-label="Cari Masakan"
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''" title="Hapus teks">
          ✕
        </button>
      </div>

      <!-- Difficulty Dropdown -->
      <div class="select-field">
        <label for="difficulty-select" class="select-label">Tingkat:</label>
        <select id="difficulty-select" v-model="selectedDifficulty" class="filter-select">
          <option value="all">Semua Tingkat</option>
          <option value="Mudah">Mudah</option>
          <option value="Sedang">Sedang</option>
          <option value="Mahir">Mahir</option>
        </select>
      </div>

      <!-- Sort Dropdown -->
      <div class="select-field">
        <label for="sort-select" class="select-label">Urutkan:</label>
        <select id="sort-select" v-model="sortBy" class="filter-select">
          <option value="featured">Paling Populer</option>
          <option value="rating">Rating Tertinggi</option>
          <option value="time-asc">Waktu Tercepat</option>
          <option value="calories-asc">Kalori Terendah</option>
        </select>
      </div>
    </div>

    <!-- Category Pills Tabs -->
    <div class="category-tabs-row">
      <button
        class="cat-tab"
        :class="{ active: selectedCategory === 'all' }"
        @click="selectedCategory = 'all'"
      >
        <span>Semua Kategori</span>
      </button>

      <button
        v-for="cat in categoriesData"
        :key="cat.id"
        class="cat-tab"
        :class="{ active: selectedCategory === cat.slug }"
        @click="selectedCategory = cat.slug"
      >
        <span>{{ cat.icon }} {{ cat.name }}</span>
      </button>
    </div>

    <!-- Recipe Grid -->
    <section v-if="filteredRecipes.length > 0" class="recipes-grid-section">
      <div class="grid-recipes">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </section>

    <!-- Empty State -->
    <div v-else class="empty-state-box">
      <div class="empty-icon">🍳</div>
      <h3>Resep Tidak Ditemukan</h3>
      <p>Tidak ada resep yang cocok dengan kriteria pencarian atau filter yang Anda pilih.</p>
      <button class="btn btn-primary" @click="resetFilters">
        Reset Semua Filter
      </button>
    </div>
  </div>
</template>

<style scoped>
.recipes-list-page {
  padding-bottom: 5rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
}

.page-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 600px;
}

.recipes-count-badge {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.count-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.count-text {
  font-size: 0.76rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.2rem;
}

/* Toolbar */
.filter-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.25rem;
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}

.search-field {
  display: flex;
  align-items: center;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 0.5rem 1rem;
  flex-grow: 1;
  min-width: 260px;
  position: relative;
}

.field-icon-svg {
  width: 17px;
  height: 17px;
  margin-right: 0.6rem;
  color: var(--text-light);
  flex-shrink: 0;
}

.filter-input {
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.92rem;
  color: var(--text-main);
  width: 100%;
}

.clear-search-btn {
  font-size: 0.8rem;
  color: var(--text-light);
  padding: 0.2rem 0.4rem;
}

.clear-search-btn:hover {
  color: var(--text-main);
}

.select-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.filter-select {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  font-family: inherit;
  font-size: 0.88rem;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: var(--primary);
}

/* Category Tabs */
.category-tabs-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  margin-bottom: 2rem;
  scrollbar-width: none;
}

.category-tabs-row::-webkit-scrollbar {
  display: none;
}

.cat-tab {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-full);
  font-size: 0.88rem;
  font-weight: 600;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.cat-tab:hover {
  border-color: var(--primary-border);
  color: var(--primary);
}

.cat-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(217, 72, 20, 0.25);
}

/* Empty State */
.empty-state-box {
  background: var(--bg-surface);
  border: 2px dashed var(--border-light);
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 520px;
  margin: 3rem auto;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.empty-state-box h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.empty-state-box p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .recipes-count-badge {
    align-self: flex-start;
  }

  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .select-field {
    justify-content: space-between;
  }
}
</style>
