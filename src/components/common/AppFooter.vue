<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { categoriesData } from '../../data/recipesData'
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-container">
      <!-- Col 1: Brand Info -->
      <div class="footer-col brand-col">
        <div class="footer-brand">
          <div class="brand-symbol-wrap">
            <svg class="brand-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
              <line x1="6" y1="17" x2="18" y2="17"/>
            </svg>
          </div>
          <span class="brand-title">Cook<span class="brand-title-accent">Book</span></span>
        </div>
        <p class="brand-desc">
          Buku panduan kuliner digital modern untuk menyajikan masakan lezat setiap hari. Takaran pas, panduan terstruktur, dan hasil masakan yang memuaskan.
        </p>
        <div class="brand-tags">
          <span class="tag-pill">Bahan Segar</span>
          <span class="tag-pill">Panduan Bertahap</span>
          <span class="tag-pill">Resep Teruji</span>
        </div>
      </div>

      <!-- Col 2: Sitemap - Destinasi Utama -->
      <div class="footer-col">
        <h4 class="footer-heading">Navigasi Utama</h4>
        <ul class="footer-links">
          <li>
            <RouterLink to="/" class="footer-link">Beranda</RouterLink>
          </li>
          <li>
            <RouterLink to="/recipes" class="footer-link">Jelajah Semua Resep</RouterLink>
          </li>
          <li>
            <RouterLink to="/pantry" class="footer-link">Kulkas Pintar (Smart Pantry)</RouterLink>
          </li>
          <li>
            <RouterLink to="/categories" class="footer-link">Kategori Masakan</RouterLink>
          </li>
          <li>
            <RouterLink to="/favorites" class="footer-link">Resep Favorit</RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="footer-link">Tips Dapur &amp; Tentang</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Col 3: Kategori Masakan -->
      <div class="footer-col">
        <h4 class="footer-heading">Kategori Pilihan</h4>
        <ul class="footer-links">
          <li v-for="cat in categoriesData" :key="cat.id">
            <RouterLink :to="`/categories/${cat.slug}`" class="footer-link">
              <span class="cat-icon">{{ cat.icon }}</span> {{ cat.name }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Col 4: Inspirasi & Info -->
      <div class="footer-col">
        <h4 class="footer-heading">Tips Dapur Hari Ini</h4>
        <div class="tip-card">
          <p class="tip-text">
            "Untuk kaldu yang gurih dan bening, rebus daging dengan api kecil perlahan tanpa menutup panci rapat, lalu bersihkan buih di permukaan."
          </p>
          <RouterLink to="/about" class="tip-link">
            <span>Baca Panduan Dapur Lengkap</span>
            <span class="arrow">&rarr;</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; 2026 CookBook Web Application. Antarmuka Kuliner Modern &amp; Cerdas.</p>
        <div class="footer-meta-nav">
          <RouterLink to="/">Beranda</RouterLink>
          <span>•</span>
          <RouterLink to="/recipes">Resep</RouterLink>
          <span>•</span>
          <RouterLink to="/pantry">Kulkas Pintar</RouterLink>
          <span>•</span>
          <RouterLink to="/about">Tentang</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #151311;
  color: #ede6da;
  padding-top: 4rem;
  margin-top: auto;
  border-top: 1px solid #282420;
}

.footer-container {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3.5rem;
}

/* Col 1 */
.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.brand-symbol-wrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary) 0%, #9a3412 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.brand-symbol {
  width: 18px;
  height: 18px;
}

.brand-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
}

.brand-title-accent {
  color: #fb923c;
}

.brand-desc {
  font-size: 0.88rem;
  color: #a8a29e;
  line-height: 1.65;
  margin-bottom: 1.25rem;
}

.brand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tag-pill {
  font-size: 0.74rem;
  font-weight: 600;
  background-color: #24201c;
  color: #fb923c;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  border: 1px solid #38322c;
}

/* Headings & Links */
.footer-heading {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 28px;
  height: 2px;
  background-color: var(--primary);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.footer-link {
  color: #a8a29e;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #ffffff;
  transform: translateX(3px);
}

.cat-icon {
  font-size: 0.95rem;
}

/* Tip Card */
.tip-card {
  background: #231f1b;
  border: 1px solid #38322c;
  padding: 1.25rem;
  border-radius: var(--radius-md);
}

.tip-text {
  font-size: 0.84rem;
  font-style: italic;
  color: #d6cfc5;
  line-height: 1.6;
  margin-bottom: 0.85rem;
}

.tip-link {
  font-size: 0.82rem;
  font-weight: 700;
  color: #fb923c;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.tip-link:hover {
  color: #fed7aa;
}

.tip-link:hover .arrow {
  transform: translateX(3px);
}

.arrow {
  transition: transform 0.2s ease;
}

/* Bottom */
.footer-bottom {
  border-top: 1px solid #231f1c;
  padding: 1.5rem 0;
  font-size: 0.82rem;
  color: #78716c;
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-meta-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-meta-nav a {
  color: #78716c;
}

.footer-meta-nav a:hover {
  color: #ffffff;
}

@media (max-width: 992px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 600px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
