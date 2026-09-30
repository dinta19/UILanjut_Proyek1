<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Category } from '../../types/recipe'

const props = defineProps<{
  category: Category
}>()

const router = useRouter()

const navigateToCategory = () => {
  router.push(`/categories/${props.category.slug}`)
}
</script>

<template>
  <div class="category-card" @click="navigateToCategory" role="button" :aria-label="category.name">
    <div class="category-image-wrap">
      <img :src="category.image" :alt="category.name" class="category-img" loading="lazy" />
      <div class="img-overlay"></div>
      <span class="category-icon-floating">{{ category.icon }}</span>
      <span class="count-badge" v-if="category.recipeCount">
        {{ category.recipeCount }} Resep
      </span>
    </div>

    <div class="category-details">
      <h3 class="category-title">{{ category.name }}</h3>
      <p class="category-desc">{{ category.description }}</p>
      <div class="category-link-hint">
        <span>Lihat Resep</span>
        <svg class="arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-border);
}

.category-image-wrap {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
  background-color: #efe8de;
}

.category-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card:hover .category-img {
  transform: scale(1.06);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%);
}

.category-icon-floating {
  position: absolute;
  bottom: -16px;
  left: 16px;
  width: 44px;
  height: 44px;
  background: var(--bg-surface);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  box-shadow: 0 4px 12px rgba(28, 25, 23, 0.12);
  border: 2px solid #ffffff;
  z-index: 2;
}

.count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(28, 25, 23, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.category-details {
  padding: 1.5rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-title {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.35rem;
  transition: color 0.2s ease;
}

.category-card:hover .category-title {
  color: var(--primary);
}

.category-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.category-link-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--primary);
  margin-top: auto;
}

.arrow-svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.category-card:hover .arrow-svg {
  transform: translateX(3px);
}
</style>
