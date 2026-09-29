<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from './components/common/AppNavbar.vue'
import AppFooter from './components/common/AppFooter.vue'
import ChefAiWidget from './components/ai/ChefAiWidget.vue'
</script>

<template>
  <div class="app-layout">
    <!-- Global Header Navbar -->
    <AppNavbar />

    <!-- Main Dynamic Route View -->
    <div class="main-content-area">
      <RouterView />
    </div>

    <!-- Floating Chef AI Assistant Widget -->
    <ChefAiWidget />

    <!-- Global Footer & Sitemap -->
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content-area {
  flex-grow: 1;
}
</style>
