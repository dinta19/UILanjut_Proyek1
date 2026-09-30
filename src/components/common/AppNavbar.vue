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
        <div class="brand-symbol-wrap">
          <svg class="brand-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
            <line x1="6" y1="17" x2="18" y2="17"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">Cook<span class="brand-title-accent">Book</span></span>
          <span class="brand-subtitle">Modern Culinary Guide</span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation Links -->
      <nav class="navbar-nav">
        <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Beranda</span>
        </RouterLink>

        <RouterLink to="/recipes" class="nav-item" :class="{ active: route.path.startsWith('/recipes') }">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
          </svg>
          <span>Jelajah Resep</span>
        </RouterLink>

        <!-- Inovasi TA: Smart Pantry Matcher -->
        <RouterLink to="/pantry" class="nav-item nav-item-pantry" :class="{ active: route.path === '/pantry' }">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="20" x="5" y="2" rx="2"/>
            <path d="M5 10h14"/>
            <path d="M15 6v2"/>
            <path d="M15 14v3"/>
          </svg>
          <span>Kulkas Pintar</span>
          <span class="pantry-spark-badge">AI Match</span>
        </RouterLink>

        <RouterLink to="/categories" class="nav-item" :class="{ active: route.path.startsWith('/categories') }">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>Kategori</span>
        </RouterLink>

        <RouterLink to="/favorites" class="nav-item" :class="{ active: route.path === '/favorites' }">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span>Favorit</span>
          <span v-if="favoriteCount > 0" class="fav-badge">{{ favoriteCount }}</span>
        </RouterLink>

        <RouterLink to="/about" class="nav-item" :class="{ active: route.path === '/about' }">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Tips &amp; Info</span>
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
          <span>Beranda</span>
        </RouterLink>
        <RouterLink to="/recipes" class="mobile-nav-link" @click="closeMobileMenu">
          <span>Jelajah Resep</span>
        </RouterLink>
        <RouterLink to="/pantry" class="mobile-nav-link" @click="closeMobileMenu">
          <span>Kulkas Pintar (Smart Pantry AI)</span>
        </RouterLink>
        <RouterLink to="/categories" class="mobile-nav-link" @click="closeMobileMenu">
          <span>Kategori Masakan</span>
        </RouterLink>
        <RouterLink to="/favorites" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="mobile-fav-row">
            <span>Resep Favorit</span>
            <span v-if="favoriteCount > 0" class="fav-badge">{{ favoriteCount }}</span>
          </span>
        </RouterLink>
        <RouterLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">
          <span>Tips Dapur &amp; Tentang</span>
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
  background-color: rgba(250, 248, 245, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(231, 226, 217, 0.8);
  box-shadow: 0 1px 3px rgba(28, 25, 23, 0.03);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-symbol-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary) 0%, #9a3412 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(194, 65, 12, 0.28);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar-brand:hover .brand-symbol-wrap {
  transform: translateY(-1px) scale(1.04);
}

.brand-symbol {
  width: 20px;
  height: 20px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.brand-title-accent {
  color: var(--primary);
}

.brand-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Nav Links */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.nav-svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  transition: transform 0.2s ease;
}

.nav-item:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

.nav-item:hover .nav-svg {
  transform: translateY(-1px);
}

.nav-item.active {
  color: var(--primary);
  background-color: var(--primary-light);
  font-weight: 700;
}

.fav-badge {
  background-color: var(--primary);
  color: white;
  font-size: 0.68rem;
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
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  font-size: 0.62rem;
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
  height: 2px;
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
  gap: 0.35rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.92rem;
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

@media (max-width: 960px) {
  .navbar-nav,
  .nav-cta {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }
}
</style>
