<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useFavorites } from '../composables/useFavorites'
import Breadcrumb from '../components/common/Breadcrumb.vue'
import RecipeCard from '../components/recipes/RecipeCard.vue'

const { favoriteRecipes, favoriteCount } = useFavorites()

const breadcrumbs = [
  { label: 'Resep Favorit' }
]
</script>

<template>
  <div class="favorites-page container fade-in">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Koleksi Resep Favorit</h1>
        <p class="page-subtitle">
          Daftar menu masakan pilihan yang telah Anda simpan. Siap dimasak kapan saja tanpa perlu mencari ulang.
        </p>
      </div>

      <div v-if="favoriteCount > 0" class="fav-count-pill">
        <span>❤️ {{ favoriteCount }} Resep Tersimpan</span>
      </div>
    </div>

    <!-- Favorite Recipes Grid -->
    <div v-if="favoriteRecipes.length > 0" class="grid-recipes">
      <RecipeCard
        v-for="recipe in favoriteRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-fav-card">
      <div class="empty-emoji">❤️</div>
      <h2>Belum Ada Resep Favorit</h2>
      <p>
        Jelajahi beragam pilihan resep kami dan klik tombol hati (❤️) pada kartu resep untuk menyimpannya di sini.
      </p>
      <div class="empty-actions">
        <RouterLink to="/recipes" class="btn btn-primary">
          Jelajah Katalog Resep Sekarang
        </RouterLink>
        <RouterLink to="/categories" class="btn btn-secondary">
          Lihat Kategori Masakan
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page {
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

.fav-count-pill {
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
}

.empty-fav-card {
  background: var(--bg-surface);
  border: 2px dashed var(--border-light);
  border-radius: 24px;
  padding: 4.5rem 2rem;
  text-align: center;
  max-width: 580px;
  margin: 2rem auto;
  box-shadow: var(--shadow-sm);
}

.empty-emoji {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  filter: grayscale(0.6);
}

.empty-fav-card h2 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.empty-fav-card p {
  font-size: 0.96rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.empty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
