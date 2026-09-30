<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Recipe } from '../../types/recipe'
import { useFavorites } from '../../composables/useFavorites'

const props = defineProps<{
  recipe: Recipe
}>()

const router = useRouter()
const { isFavorite, toggleFavorite } = useFavorites()

const goToDetail = () => {
  router.push(`/recipes/${props.recipe.id}`)
}

const handleFavoriteClick = (e: MouseEvent) => {
  e.stopPropagation()
  toggleFavorite(props.recipe.id)
}
</script>

<template>
  <div class="recipe-card" @click="goToDetail" role="article" :aria-label="recipe.title">
    <!-- Image & Floating Badges -->
    <div class="card-media">
      <img :src="recipe.image" :alt="recipe.title" class="recipe-img" loading="lazy" />
      
      <!-- Gradient Overlay -->
      <div class="media-overlay"></div>

      <!-- Category Pill -->
      <span class="category-tag">
        {{ recipe.categoryName }}
      </span>

      <!-- Favorite Button -->
      <button
        class="favorite-btn"
        :class="{ active: isFavorite(recipe.id) }"
        @click="handleFavoriteClick"
        :title="isFavorite(recipe.id) ? 'Hapus dari Favorit' : 'Simpan ke Favorit'"
        :aria-label="isFavorite(recipe.id) ? 'Hapus dari Favorit' : 'Simpan ke Favorit'"
      >
        <svg class="heart-svg" viewBox="0 0 24 24" :fill="isFavorite(recipe.id) ? '#ef4444' : 'none'" :stroke="isFavorite(recipe.id) ? '#ef4444' : '#1c1917'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </button>

      <!-- Difficulty Badge -->
      <span class="difficulty-badge" :class="`badge-difficulty-${recipe.difficulty.toLowerCase()}`">
        {{ recipe.difficulty }}
      </span>
    </div>

    <!-- Card Body -->
    <div class="card-content">
      <!-- Rating & Reviews -->
      <div class="card-rating">
        <svg class="star-svg" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="rating-val">{{ recipe.rating.toFixed(1) }}</span>
        <span class="reviews-count">({{ recipe.reviewsCount }} ulasan)</span>
      </div>

      <!-- Title -->
      <h3 class="recipe-title">{{ recipe.title }}</h3>

      <!-- Description snippet -->
      <p class="recipe-desc">{{ recipe.description }}</p>

      <!-- Meta Info -->
      <div class="card-meta">
        <div class="meta-item" title="Waktu Memasak">
          <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{{ recipe.totalTimeMinutes }} mnt</span>
        </div>
        <div class="meta-item" title="Porsi Saji">
          <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>{{ recipe.servings }} porsi</span>
        </div>
        <div class="meta-item" title="Kalori per Porsi">
          <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          <span>{{ recipe.caloriesPerServing }} kkal</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-border);
}

/* Media */
.card-media {
  position: relative;
  width: 100%;
  height: 205px;
  overflow: hidden;
  background-color: #f3efe8;
}

.recipe-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .recipe-img {
  transform: scale(1.05);
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.35) 100%);
  pointer-events: none;
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-main);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.difficulty-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
  z-index: 2;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background-color: #ffffff;
}

.favorite-btn:active {
  transform: scale(0.92);
}

.heart-svg {
  width: 17px;
  height: 17px;
  transition: transform 0.2s ease;
}

.favorite-btn.active .heart-svg {
  transform: scale(1.1);
}

/* Content */
.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
  font-size: 0.84rem;
}

.star-svg {
  width: 14px;
  height: 14px;
}

.rating-val {
  font-weight: 700;
  color: var(--text-main);
}

.reviews-count {
  color: var(--text-light);
  font-size: 0.78rem;
}

.recipe-title {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.35;
  margin-bottom: 0.45rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.recipe-card:hover .recipe-title {
  color: var(--primary);
}

.recipe-desc {
  font-size: 0.86rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

/* Meta */
.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
}

.meta-svg {
  width: 14px;
  height: 14px;
  stroke-width: 2;
  color: var(--text-light);
}
</style>
