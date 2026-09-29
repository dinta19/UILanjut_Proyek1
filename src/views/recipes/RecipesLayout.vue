<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="recipes-layout-wrapper">
    <!-- RouterView will render either RecipesListView or RecipeDetailView -->
    <RouterView v-slot="{ Component }">
      <transition name="fade-page" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
.recipes-layout-wrapper {
  min-height: calc(100vh - 200px);
}

.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
