<script setup lang="ts">
import { RouterLink } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="breadcrumb-nav" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <RouterLink to="/" class="breadcrumb-link home-link">
          <span class="home-icon">🏠</span> Beranda
        </RouterLink>
      </li>

      <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <span class="separator">/</span>
        <RouterLink v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">
          {{ item.label }}
        </RouterLink>
        <span v-else class="current-item" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-nav {
  padding: 0.85rem 0;
  margin-bottom: 1.5rem;
}

.breadcrumb-list {
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.88rem;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.home-icon {
  font-size: 0.95rem;
}

.separator {
  color: var(--text-light);
  font-size: 0.85rem;
}

.current-item {
  color: var(--primary);
  font-weight: 600;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
