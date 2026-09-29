<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useFavorites } from '../../composables/useFavorites'

const route = useRoute()
const { favoriteCount } = useFavorites()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="navbar-wrapper">
    <div class="container navbar-container">
      <!-- Brand Logo -->
      <RouterLink to="/" class="navbar-brand" @click="closeMobileMenu">
        <span class="brand-icon">🍳</span>
        <div class="brand-text">
          <span class="brand-title">CookBook</span>
          <span class="brand-subtitle">Resep Lezat Rumahan</span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation Links -->
      <nav class="navbar-nav">
        <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <span class="nav-icon">🏠</span> Beranda
        </RouterLink>

        <RouterLink to="/recipes" class="nav-item" :class="{ active: route.path.startsWith('/recipes') }">
          <span class="nav-icon">📖</span> Jelajah Resep
        </RouterLink>

        <!-- Inovasi TA: Smart Pantry Matcher -->
        <RouterLink to="/pantry" class="nav-item nav-item-pantry" :class="{ active: route.path === '/pantry' }">
          <span class="nav-icon">🧊</span> Kulkas Pintar
          <span class="pantry-spark-badge">AI Match</span>
        </RouterLink>

        <RouterLink to="/categories" class="nav-item" :class="{ active: route.path.startsWith('/categories') }">
          <span class="nav-icon">🏷️</span> Kategori
        </RouterLink>

        <RouterLink to="/favorites" class="nav-item" :class="{ active: route.path === '/favorites' }">
          <span class="nav-icon">❤️</span> Favorit
          <span v-if="favoriteCount > 0" class="fav-badge">{{ favoriteCount }}</span>
        </RouterLink>

        <RouterLink to="/about" class="nav-item" :class="{ active: route.path === '/about' }">
          <span class="nav-icon">💡</span> Tips & Tentang
        </RouterLink>
      </nav>

      <!-- CTA Button in Navbar -->
      <div class="navbar-actions">
        <RouterLink to="/recipes" class="btn btn-primary btn-sm nav-cta">
          <span>+ Cari Inspirasi</span>
        </RouterLink>

        <!-- Mobile Menu Toggle Button -->
        <button
          class="mobile-toggle"
          @click="toggleMobileMenu"
          aria-label="Toggle Navigation Menu"
          :aria-expanded="isMobileMenuOpen"
        >
          <span class="hamburger-bar" :class="{ open: isMobileMenuOpen }"></span>
          <span class="hamburger-bar" :class="{ open: isMobileMenuOpen }"></span>
          <span class="hamburger-bar" :class="{ open: isMobileMenuOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div v-if="isMobileMenuOpen" class="mobile-drawer fade-in">
      <div class="container mobile-drawer-content">
        <RouterLink to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <span>🏠 Beranda</span>
        </RouterLink>
        <RouterLink to="/recipes" class="mobile-nav-link" @click="closeMobileMenu">
          <span>📖 Jelajah Resep</span>
        </RouterLink>
        <RouterLink to="/pantry" class="mobile-nav-link" @click="closeMobileMenu">
          <span>🧊 Kulkas Pintar (Smart Pantry)</span>
        </RouterLink>
        <RouterLink to="/categories" class="mobile-nav-link" @click="closeMobileMenu">
          <span>🏷️ Kategori Masakan</span>
        </RouterLink>
        <RouterLink to="/favorites" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="mobile-fav-row">
            <span>❤️ Resep Favorit</span>
            <span v-if="favoriteCount > 0" class="fav-badge">{{ favoriteCount }}</span>
          </span>
        </RouterLink>
        <RouterLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">
          <span>💡 Tips Dapur & Tentang</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(253, 251, 247, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 12px rgba(40, 25, 10, 0.04);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(217, 72, 20, 0.2));
  transition: transform 0.3s ease;
}

.navbar-brand:hover .brand-icon {
  transform: rotate(-10deg) scale(1.1);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* Nav Links */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.95rem;
  border-radius: var(--radius-full);
  color: var(--text-main);
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-icon {
  font-size: 1rem;
}

.nav-item:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

.nav-item.active {
  color: var(--primary);
  background-color: var(--primary-light);
}

.fav-badge {
  background-color: var(--primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.pantry-spark-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* Actions & Mobile */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 38px;
  height: 38px;
  padding: 8px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
}

.hamburger-bar {
  width: 100%;
  height: 2.5px;
  background-color: var(--text-main);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile Drawer */
.mobile-drawer {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  padding: 1rem 0;
}

.mobile-drawer-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  color: var(--text-main);
  text-decoration: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background-color: var(--primary-light);
  color: var(--primary);
}

.mobile-fav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

@media (max-width: 860px) {
  .navbar-nav,
  .nav-cta {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }
}
</style>
