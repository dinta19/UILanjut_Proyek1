<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { categoriesData, recipesData } from '../../data/recipesData'
import Breadcrumb from '../../components/common/Breadcrumb.vue'
import CategoryCard from '../../components/recipes/CategoryCard.vue'

const breadcrumbs = [
  { label: 'Kategori Masakan' }
]

// Enrich categories with actual count
const enrichedCategories = categoriesData.map((cat) => {
  const count = recipesData.filter((r) => r.categorySlug === cat.slug).length
  return {
    ...cat,
    recipeCount: count
  }
})
</script>

<template>
  <div class="categories-list-page container">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Kategori Masakan</h1>
        <p class="page-subtitle">
          Pilih kategori hidangan sesuai selera dan suasana makan keluarga Anda hari ini.
        </p>
      </div>

      <RouterLink to="/recipes" class="btn btn-secondary">
        Lihat Semua Resep Campuran &rarr;
      </RouterLink>
    </div>

    <!-- Categories Grid -->
    <div class="grid-categories">
      <CategoryCard
        v-for="cat in enrichedCategories"
        :key="cat.id"
        :category="cat"
      />
    </div>

    <!-- Culinary Tip Banner -->
    <div class="category-banner-info">
      <div class="banner-icon">💡</div>
      <div class="banner-text">
        <h3>Bingung Ingin Masak Apa Hari Ini?</h3>
        <p>Coba gunakan fitur pencarian pintar di katalog resep kami berdasarkan bahan yang Anda miliki di kulkas!</p>
      </div>
      <RouterLink to="/recipes" class="btn btn-primary btn-sm">
        Buka Pencarian Bahan
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.categories-list-page {
  padding-bottom: 5rem;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
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

.category-banner-info {
  margin-top: 3.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}

.banner-icon {
  font-size: 2.2rem;
}

.banner-text {
  flex-grow: 1;
}

.banner-text h3 {
  font-size: 1.15rem;
  margin-bottom: 0.25rem;
}

.banner-text p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
