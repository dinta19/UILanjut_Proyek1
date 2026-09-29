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
          <span class="brand-icon">🍳</span>
          <span class="brand-title">CookBook</span>
        </div>
        <p class="brand-desc">
          Buku resep digital modern untuk menyajikan masakan lezat setiap hari bagi keluarga tercinta. Takaran pas, langkah mudah, dan hasil memuaskan.
        </p>
        <div class="brand-tags">
          <span class="tag-pill">🌱 Bahan Segar</span>
          <span class="tag-pill">⏱️ Masak Cepat</span>
          <span class="tag-pill">📖 Resep Teruji</span>
        </div>
      </div>

      <!-- Col 2: Sitemap - Destinasi Utama -->
      <div class="footer-col">
        <h4 class="footer-heading">Sitemap Navigasi</h4>
        <ul class="footer-links">
          <li>
            <RouterLink to="/" class="footer-link">🏠 Beranda (Home)</RouterLink>
          </li>
          <li>
            <RouterLink to="/recipes" class="footer-link">📖 Jelajah Semua Resep</RouterLink>
          </li>
          <li>
            <RouterLink to="/categories" class="footer-link">🏷️ Kategori Masakan</RouterLink>
          </li>
          <li>
            <RouterLink to="/favorites" class="footer-link">❤️ Resep Favorit Tersimpan</RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="footer-link">💡 Tips Dapur & Konversi</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Col 3: Kategori Masakan (Child Navigation quick access) -->
      <div class="footer-col">
        <h4 class="footer-heading">Kategori Masakan</h4>
        <ul class="footer-links">
          <li v-for="cat in categoriesData" :key="cat.id">
            <RouterLink :to="`/categories/${cat.slug}`" class="footer-link">
              <span>{{ cat.icon }}</span> {{ cat.name }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Col 4: Inspirasi & Info -->
      <div class="footer-col">
        <h4 class="footer-heading">Tips Dapur Hari Ini</h4>
        <div class="tip-card">
          <p class="tip-text">
            "Untuk kaldu yang gurih dan bening, rebus daging dengan api kecil tanpa menutup panci rapat, lalu bersihkan buih di permukaan."
          </p>
          <RouterLink to="/about" class="tip-link">Baca Panduan Dapur Lengkap &rarr;</RouterLink>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; 2026 CookBook Web Application. Frontend Vue.js Sederhana &amp; Interaktif.</p>
        <div class="footer-meta-nav">
          <RouterLink to="/">Beranda</RouterLink>
          <span>•</span>
          <RouterLink to="/recipes">Resep</RouterLink>
          <span>•</span>
          <RouterLink to="/about">Tentang</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #1e1b18;
  color: #ede6da;
  padding-top: 4rem;
  margin-top: auto;
  border-top: 1px solid #332d27;
}

.footer-container {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3.5rem;
}

/* Col 1 */
.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.brand-icon {
  font-size: 2rem;
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
}

.brand-desc {
  font-size: 0.9rem;
  color: #a89f91;
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.brand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  font-size: 0.75rem;
  background-color: #2b2622;
  color: #f59e0b;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  border: 1px solid #3d352f;
}

/* Headings & Links */
.footer-heading {
  color: #ffffff;
  font-size: 1.05rem;
  margin-bottom: 1.25rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 32px;
  height: 2px;
  background-color: var(--primary);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: #bbb0a0;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #ffffff;
  transform: translateX(4px);
}

/* Tip Card */
.tip-card {
  background: #2b2622;
  border: 1px solid #3d352f;
  padding: 1.25rem;
  border-radius: var(--radius-md);
}

.tip-text {
  font-size: 0.85rem;
  font-style: italic;
  color: #ded6cb;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.tip-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f59e0b;
  display: inline-block;
}

.tip-link:hover {
  color: #fbbf24;
  text-decoration: underline;
}

/* Bottom */
.footer-bottom {
  border-top: 1px solid #2e2823;
  padding: 1.5rem 0;
  font-size: 0.82rem;
  color: #8c8375;
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
  color: #8c8375;
}

.footer-meta-nav a:hover {
  color: #ffffff;
}

@media (max-width: 992px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
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
