<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { recipesData, categoriesData } from '../data/recipesData'
import RecipeCard from '../components/recipes/RecipeCard.vue'
import CategoryCard from '../components/recipes/CategoryCard.vue'

const router = useRouter()
const searchKeyword = ref('')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/recipes',
      query: { q: searchKeyword.value.trim() }
    })
  } else {
    router.push('/recipes')
  }
}

// Featured recipes
const featuredRecipes = computed(() => {
  return recipesData.filter((r) => r.isFeatured)
})

// Quick stats
const totalRecipesCount = recipesData.length
const totalCategoriesCount = categoriesData.length
</script>

<template>
  <main class="home-page fade-in">
    <!-- Hero Section (Taste-Skill compliant viewport height and hierarchy) -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Koleksi Resep Keluarga Teruji</span>
          </div>

          <h1 class="hero-title">
            Masak Masakan Lezat Jadi <span class="highlight-text">Mudah &amp; Menyenangkan</span>
          </h1>

          <p class="hero-subtitle">
            Kumpulan kreasi kuliner Nusantara dan Internasional teruji dengan takaran presisi, panduan langkah demi langkah, dan inspirasi dapur harian.
          </p>

          <!-- Search Bar in Hero -->
          <form class="hero-search-box" @submit.prevent="handleSearch">
            <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              class="hero-search-input"
              placeholder="Cari resep seperti rendang, pasta, sup ayam..."
              aria-label="Cari Resep"
            />
            <button type="submit" class="btn btn-primary search-submit-btn">
              Cari Resep
            </button>
          </form>

          <!-- Quick Suggestions -->
          <div class="quick-keywords">
            <span class="keywords-label">Populer:</span>
            <RouterLink to="/recipes?category=nusantara" class="keyword-pill">Rendang Sapi</RouterLink>
            <RouterLink to="/recipes?category=western" class="keyword-pill">Carbonara</RouterLink>
            <RouterLink to="/recipes?category=sarapan" class="keyword-pill">Pancake Fluffy</RouterLink>
            <RouterLink to="/recipes?category=dessert" class="keyword-pill">Cheesecake</RouterLink>
          </div>

          <!-- Hero Metrics -->
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">{{ totalRecipesCount }}+</span>
              <span class="stat-label">Resep Teruji</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">{{ totalCategoriesCount }}</span>
              <span class="stat-label">Kategori Masakan</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">100%</span>
              <span class="stat-label">Bahan Praktis</span>
            </div>
          </div>
        </div>

        <!-- Hero Visual Banner -->
        <div class="hero-banner-visual">
          <div class="visual-card-wrap">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
              alt="Hidangan Lezat CookBook"
              class="visual-hero-img"
            />
            <div class="visual-badge-overlay">
              <span class="badge-star-icon">★</span>
              <span>Resep Unggulan</span>
            </div>
            <div class="floating-recipe-card">
              <div class="float-icon">4.9 ★</div>
              <div class="float-info">
                <h4>Menu Spesial Hari Ini</h4>
                <p>Rendang Padang Tradisional</p>
              </div>
              <RouterLink to="/recipes/rendang-daging-sapi" class="float-btn" aria-label="Buka resep Rendang Padang">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Kategori Masakan Favorit</h2>
            <p class="section-desc">Pilihan sajian yang dikurasi sesuai momen dan selera keluarga</p>
          </div>
          <RouterLink to="/categories" class="btn btn-secondary btn-sm">
            Lihat Semua Kategori &rarr;
          </RouterLink>
        </div>

        <div class="grid-categories">
          <CategoryCard
            v-for="category in categoriesData"
            :key="category.id"
            :category="category"
          />
        </div>
      </div>
    </section>

    <!-- Featured Recipes Section -->
    <section class="featured-recipes-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Resep Pilihan Hari Ini</h2>
            <p class="section-desc">Menu terpopuler dengan ulasan tertinggi dari komunitas memasak</p>
          </div>
          <RouterLink to="/recipes" class="btn btn-secondary btn-sm">
            Jelajah Semua Resep &rarr;
          </RouterLink>
        </div>

        <div class="grid-recipes">
          <RecipeCard
            v-for="recipe in featuredRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
      </div>
    </section>

    <!-- Inovasi Dapur Pintar: Smart Pantry & Hands-Free Voice Mode -->
    <section class="ta-novelty-section">
      <div class="container">
        <div class="novelty-banner-card">
          <div class="novelty-header">
            <span class="novelty-kicker">Inovasi Dapur Cerdas</span>
            <h2 class="novelty-title">Pembaruan Teknologi Memasak Modern</h2>
            <p class="novelty-desc">
              CookBook menghadirkan terobosan mutakhir untuk menjawab permasalahan dapur nyata: dari rekomendasi bahan kulkas seadanya hingga panduan memasak tanpa menyentuh layar.
            </p>
          </div>

          <div class="novelty-grid">
            <!-- Card 1: Smart Pantry -->
            <div class="novelty-item-box">
              <div class="box-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="box-svg">
                  <rect width="14" height="20" x="5" y="2" rx="2"/>
                  <path d="M5 10h14"/>
                  <path d="M15 6v2"/>
                  <path d="M15 14v3"/>
                </svg>
              </div>
              <div class="box-content">
                <span class="box-tag">Algoritma Jaccard Similarity</span>
                <h3>Smart Pantry Matcher</h3>
                <p>
                  Bingung mau masak apa dengan isi kulkasmu? Masukkan bahan yang tersedia, sistem menghitung persentase kecocokan resep secara cerdas.
                </p>
                <RouterLink to="/pantry" class="novelty-link-btn">
                  <span>Buka Kulkas Pintar</span>
                  <span class="arrow">&rarr;</span>
                </RouterLink>
              </div>
            </div>

            <!-- Card 2: Voice Assistant -->
            <div class="novelty-item-box">
              <div class="box-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="box-svg">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </div>
              <div class="box-content">
                <span class="box-tag">Web Speech Recognition &amp; TTS</span>
                <h3>Hands-Free Voice Assistant</h3>
                <p>
                  Tangan kotor kena bumbu atau basah? Ikuti panduan resep langkah demi langkah menggunakan perintah suara tanpa sentuh layar ponsel.
                </p>
                <RouterLink to="/recipes/rendang-daging-sapi" class="novelty-link-btn secondary">
                  <span>Coba Demo Suara di Resep</span>
                  <span class="arrow">&rarr;</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition / Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-inner">
          <div class="feature-item">
            <div class="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feat-svg">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="M7 21h10"/>
                <path d="M12 3v18"/>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
              </svg>
            </div>
            <h3>Takaran Akurat &amp; Teruji</h3>
            <p>Setiap resep telah diuji di dapur keluarga dengan takaran bahan yang presisi agar anti-gagal.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feat-svg">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3>Langkah Interaktif</h3>
            <p>Daftar periksa bahan masakan dan panduan memasak terstruktur dari persiapan hingga penyajian.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feat-svg">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <h3>Simpan Resep Favorit</h3>
            <p>Tandai resep kesukaanmu dengan satu sentuhan dan akses kapan saja tanpa ribet.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-banner-section">
      <div class="container">
        <div class="cta-banner-card">
          <div class="cta-text">
            <h2>Mulai Masak Hari Ini Bersama CookBook</h2>
            <p>Temukan ratusan ide masakan sehari-hari dari sarapan praktis hingga hidangan istimewa keluarga.</p>
          </div>
          <div class="cta-buttons">
            <RouterLink to="/recipes" class="btn btn-primary cta-btn-white">
              Buka Katalog Resep
            </RouterLink>
            <RouterLink to="/about" class="btn btn-secondary cta-btn-ghost">
              Pelajari Tips Dapur
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  padding-bottom: 3.5rem;
}

/* Hero Section */
.hero-section {
  padding: 3.25rem 0 4.25rem;
  background: radial-gradient(circle at 10% 20%, #fff7ed 0%, #faf8f5 75%);
  border-bottom: 1px solid var(--border-light);
}

.hero-container {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 3.5rem;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  border: 1px solid var(--primary-border);
  color: var(--primary);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(194, 65, 12, 0.08);
}

.badge-dot {
  width: 7px;
  height: 7px;
  background-color: var(--primary);
  border-radius: var(--radius-full);
}

.hero-title {
  font-size: 2.85rem;
  font-weight: 800;
  line-height: 1.16;
  letter-spacing: -0.03em;
  margin-bottom: 1.1rem;
}

.highlight-text {
  color: var(--primary);
  font-style: italic;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.75rem;
  max-width: 520px;
}

/* Hero Search */
.hero-search-box {
  width: 100%;
  max-width: 540px;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  padding: 0.35rem 0.45rem 0.35rem 1.2rem;
  box-shadow: var(--shadow-md);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 1rem;
}

.hero-search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 6px 24px rgba(194, 65, 12, 0.16);
}

.search-icon-svg {
  width: 19px;
  height: 19px;
  color: var(--text-light);
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.hero-search-input {
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text-main);
  flex-grow: 1;
}

.hero-search-input::placeholder {
  color: var(--text-subtle);
}

.search-submit-btn {
  padding: 0.7rem 1.45rem;
}

/* Quick pills */
.quick-keywords {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.84rem;
}

.keywords-label {
  color: var(--text-light);
  font-weight: 600;
}

.keyword-pill {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.keyword-pill:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-border);
  color: var(--primary);
  transform: translateY(-1px);
}

/* Hero Stats */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background-color: var(--border-light);
}

/* Hero Visual Banner */
.hero-banner-visual {
  position: relative;
}

.visual-card-wrap {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(28, 25, 23, 0.12);
  border: 4px solid #ffffff;
}

.visual-hero-img {
  width: 100%;
  height: 440px;
  object-fit: cover;
  display: block;
}

.visual-badge-overlay {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(28, 25, 23, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-star-icon {
  color: #fbbf24;
}

.floating-recipe-card {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.float-icon {
  background-color: #fffbeb;
  color: #b45309;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 0.4rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid #fde68a;
  white-space: nowrap;
}

.float-info {
  flex-grow: 1;
}

.float-info h4 {
  font-size: 0.74rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.float-info p {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--text-main);
}

.float-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
  flex-shrink: 0;
}

.float-btn:hover {
  transform: scale(1.1);
  background: var(--primary-hover);
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

/* Sections */
.categories-section,
.featured-recipes-section {
  padding: 4.25rem 0 2rem;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.95rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.section-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* TA Novelty Showcase Section */
.ta-novelty-section {
  padding: 3rem 0;
}

.novelty-banner-card {
  background: linear-gradient(145deg, #1c1917, #131110);
  border: 1px solid rgba(249, 115, 22, 0.25);
  border-radius: var(--radius-xl);
  padding: 3.25rem;
  color: #f7f4ee;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22);
}

.novelty-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 2.5rem auto;
}

.novelty-kicker {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #fb923c;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.novelty-title {
  font-size: 2.1rem;
  color: #ffffff;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

.novelty-desc {
  font-size: 0.96rem;
  color: #a8a29e;
  line-height: 1.6;
}

.novelty-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.novelty-item-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.novelty-item-box:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(249, 115, 22, 0.5);
  transform: translateY(-4px);
}

.box-icon-wrap {
  width: 52px;
  height: 52px;
  background: rgba(194, 65, 12, 0.18);
  border: 1px solid rgba(249, 115, 22, 0.35);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fb923c;
  flex-shrink: 0;
}

.box-svg {
  width: 26px;
  height: 26px;
}

.box-content {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.box-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #fb923c;
  background: rgba(249, 115, 22, 0.15);
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  width: fit-content;
}

.box-content h3 {
  font-size: 1.3rem;
  color: #ffffff;
  font-weight: 700;
}

.box-content p {
  font-size: 0.88rem;
  color: #a8a29e;
  line-height: 1.5;
}

.novelty-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #fb923c;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
}

.novelty-link-btn:hover {
  color: #fed7aa;
}

.novelty-link-btn:hover .arrow {
  transform: translateX(4px);
}

.novelty-link-btn.secondary {
  color: #38bdf8;
}

.novelty-link-btn.secondary:hover {
  color: #bae6fd;
}

.arrow {
  transition: transform 0.2s ease;
}

/* Features */
.features-section {
  padding: 3rem 0;
  margin-top: 1rem;
}

.features-inner {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 3rem 2.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--primary-light);
  border: 1px solid var(--primary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 1.25rem;
}

.feat-svg {
  width: 24px;
  height: 24px;
}

.feature-item h3 {
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
}

.feature-item p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.55;
}

/* CTA */
.cta-banner-section {
  padding: 2.5rem 0 1rem;
}

.cta-banner-card {
  background: linear-gradient(135deg, #c2410c 0%, #9a3412 100%);
  color: white;
  border-radius: var(--radius-xl);
  padding: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 16px 36px rgba(194, 65, 12, 0.28);
  flex-wrap: wrap;
}

.cta-text h2 {
  color: white;
  font-size: 1.95rem;
  margin-bottom: 0.6rem;
}

.cta-text p {
  color: #fed7aa;
  font-size: 1.02rem;
  max-width: 580px;
}

.cta-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn-white {
  background: white;
  color: var(--primary);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.cta-btn-white:hover {
  background: #fff7ed;
  color: var(--primary-hover);
}

.cta-btn-ghost {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border-color: rgba(255, 255, 255, 0.35);
}

.cta-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: white;
  color: white;
}

@media (max-width: 992px) {
  .novelty-grid {
    grid-template-columns: 1fr;
  }

  .novelty-banner-card {
    padding: 2.25rem 1.75rem;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .features-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .cta-banner-card {
    padding: 2.5rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2.15rem;
  }

  .hero-search-box {
    flex-direction: column;
    border-radius: var(--radius-md);
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .hero-search-input {
    width: 100%;
  }

  .search-submit-btn {
    width: 100%;
  }

  .visual-hero-img {
    height: 280px;
  }
}
</style>
