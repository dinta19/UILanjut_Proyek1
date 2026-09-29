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
        <span class="arrow">&rarr;</span>
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card:hover {
  transform: translateY(-6px);
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
  transition: transform 0.6s ease;
}

.category-card:hover .category-img {
  transform: scale(1.08);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%);
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
  font-size: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border: 2px solid #ffffff;
  z-index: 2;
}

.count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
}

.category-details {
  padding: 1.5rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.35rem;
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
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  margin-top: auto;
}

.category-card:hover .arrow {
  transform: translateX(4px);
}

.arrow {
  transition: transform 0.2s ease;
}
</style>
