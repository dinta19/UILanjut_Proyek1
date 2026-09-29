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
        <span class="heart-icon">{{ isFavorite(recipe.id) ? '❤️' : '🤍' }}</span>
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
        <span class="star-icon">⭐</span>
        <span class="rating-val">{{ recipe.rating.toFixed(1) }}</span>
        <span class="reviews-count">({{ recipe.reviewsCount }} ulasan)</span>
      </div>

      <!-- Title -->
      <h3 class="recipe-title">{{ recipe.title }}</h3>

      <!-- Description snippet -->
      <p class="recipe-desc">{{ recipe.description }}</p>

      <!-- Meta Info -->
      <div class="card-meta">
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <span>{{ recipe.totalTimeMinutes }} mnt</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">👥</span>
          <span>{{ recipe.servings }} porsi</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">🔥</span>
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-border);
}

/* Media */
.card-media {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f3efe8;
}

.recipe-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .recipe-img {
  transform: scale(1.06);
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(6px);
  color: var(--text-main);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.difficulty-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.74rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, background-color 0.2s ease;
  z-index: 2;
}

.favorite-btn:hover {
  transform: scale(1.15);
  background-color: #ffffff;
}

.heart-icon {
  font-size: 1.15rem;
  line-height: 1;
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
  font-size: 0.85rem;
}

.star-icon {
  font-size: 0.9rem;
}

.rating-val {
  font-weight: 700;
  color: var(--text-main);
}

.reviews-count {
  color: var(--text-light);
  font-size: 0.8rem;
}

.recipe-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.35;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-desc {
  font-size: 0.88rem;
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
  border-top: 1px dashed var(--border-light);
  font-size: 0.82rem;
  color: var(--text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
}

.meta-icon {
  font-size: 0.95rem;
}
</style>
