<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { categoriesData, recipesData } from '../../data/recipesData'
import Breadcrumb from '../../components/common/Breadcrumb.vue'
import RecipeCard from '../../components/recipes/RecipeCard.vue'

const route = useRoute()
const router = useRouter()

// Find current category by slug
const category = computed(() => {
  const slug = route.params.slug as string
  return categoriesData.find((c) => c.slug === slug)
})

// Recipes belonging to this category
const categoryRecipes = computed(() => {
  if (!category.value) return []
  return recipesData.filter((r) => r.categorySlug === category.value?.slug)
})

// Breadcrumbs
const breadcrumbs = computed(() => {
  if (!category.value) {
    return [
      { label: 'Kategori Masakan', to: '/categories' },
      { label: 'Kategori Tidak Ditemukan' }
    ]
  }
  return [
    { label: 'Kategori Masakan', to: '/categories' },
    { label: category.value.name }
  ]
})

// Other categories for quick switching
const otherCategories = computed(() => {
  return categoriesData.filter((c) => c.slug !== category.value?.slug)
})

const goBackToCategories = () => {
  router.push('/categories')
}
</script>

<template>
  <div v-if="category" class="category-detail-page container fade-in">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Navigation Bar -->
    <div class="category-nav-bar">
      <button class="back-link-btn" @click="goBackToCategories">
        <span>&larr;</span> Kembali ke Semua Kategori
      </button>

      <!-- Quick switcher pills -->
      <div class="cat-switcher-pills">
        <span class="switcher-label">Kategori Lain:</span>
        <RouterLink
          v-for="cat in otherCategories"
          :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="switch-pill"
        >
          <span>{{ cat.icon }} {{ cat.name }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- Category Banner Header -->
    <div class="category-hero-banner">
      <div class="banner-overlay"></div>
      <img :src="category.image" :alt="category.name" class="banner-bg-img" />

      <div class="banner-content">
        <span class="banner-icon-badge">{{ category.icon }}</span>
        <h1 class="banner-title">{{ category.name }}</h1>
        <p class="banner-desc">{{ category.description }}</p>
        <span class="banner-count">
          {{ categoryRecipes.length }} Resep Tersedia dalam Kategori Ini
        </span>
      </div>
    </div>

    <!-- Recipes List in Category -->
    <section class="category-recipes-section">
      <div v-if="categoryRecipes.length > 0" class="grid-recipes">
        <RecipeCard
          v-for="recipe in categoryRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div v-else class="empty-state-box">
        <div class="empty-icon">🍲</div>
        <h3>Belum Ada Resep di Kategori Ini</h3>
        <p>Resep untuk kategori ini sedang disiapkan oleh tim koki kami.</p>
        <RouterLink to="/recipes" class="btn btn-primary">
          Lihat Semua Resep Lainnya
        </RouterLink>
      </div>
    </section>
  </div>

  <!-- Not Found State -->
  <div v-else class="container empty-state-box not-found-category">
    <div class="empty-icon">🏷️</div>
    <h2>Kategori Tidak Ditemukan</h2>
    <p>Kategori masakan yang Anda pilih tidak tersedia di sistem CookBook.</p>
    <RouterLink to="/categories" class="btn btn-primary">
      Kembali ke Daftar Kategori
    </RouterLink>
  </div>
</template>

<style scoped>
.category-detail-page {
  padding-bottom: 5rem;
}

.category-nav-bar {
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

.cat-switcher-pills {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.switcher-label {
  font-size: 0.82rem;
  color: var(--text-light);
  font-weight: 600;
}

.switch-pill {
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-full);
  color: var(--text-muted);
}

.switch-pill:hover {
  border-color: var(--primary-border);
  color: var(--primary);
}

/* Category Hero Banner */
.category-hero-banner {
  position: relative;
  height: 260px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 3rem;
  display: flex;
  align-items: flex-end;
  padding: 2.5rem;
}

.banner-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.75) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  color: #ffffff;
  max-width: 650px;
}

.banner-icon-badge {
  font-size: 2rem;
  display: inline-block;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.banner-title {
  color: #ffffff;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.banner-desc {
  font-size: 1rem;
  color: #f1ede6;
  line-height: 1.5;
  margin-bottom: 0.85rem;
}

.banner-count {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .category-hero-banner {
    height: auto;
    padding: 1.75rem;
  }

  .banner-title {
    font-size: 1.8rem;
  }
}
</style>
