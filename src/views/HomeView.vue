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
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">✨</span>
            <span>Buku Resep Masakan Keluarga No. 1</span>
          </div>

          <h1 class="hero-title">
            Masak Masakan Lezat Jadi <span class="highlight-text">Mudah &amp; Menyenangkan</span>
          </h1>

          <p class="hero-subtitle">
            Temukan aneka kreasi resep masakan Nusantara dan Internasional teruji. Lengkap dengan takaran presisi, panduan bertahap, dan tips dapur rahasia.
          </p>

          <!-- Search Bar in Hero -->
          <form class="hero-search-box" @submit.prevent="handleSearch">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchKeyword"
              type="text"
              class="hero-search-input"
              placeholder="Cari resep seperti rendang, pasta, bubur..."
              aria-label="Cari Resep"
            />
            <button type="submit" class="btn btn-primary search-submit-btn">
              Cari Resep
            </button>
          </form>

          <!-- Quick Suggestions -->
          <div class="quick-keywords">
            <span class="keywords-label">Paling Dicari:</span>
            <RouterLink to="/recipes?category=nusantara" class="keyword-pill">🍛 Rendang Sapi</RouterLink>
            <RouterLink to="/recipes?category=western" class="keyword-pill">🍝 Carbonara</RouterLink>
            <RouterLink to="/recipes?category=sarapan" class="keyword-pill">🥞 Pancake</RouterLink>
            <RouterLink to="/recipes?category=dessert" class="keyword-pill">🍰 Cheesecake</RouterLink>
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
            <div class="floating-recipe-card">
              <div class="float-icon">⭐ 4.9</div>
              <div class="float-info">
                <h4>Menu Spesial Hari Ini</h4>
                <p>Rendang Padang Tradisional</p>
              </div>
              <RouterLink to="/recipes/rendang-daging-sapi" class="float-btn">&rarr;</RouterLink>
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
            <span class="section-kicker">Pilihan Selera</span>
            <h2 class="section-title">Kategori Masakan Favorit</h2>
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
            <span class="section-kicker">Rekomendasi Chef</span>
            <h2 class="section-title">Resep Pilihan Hari Ini</h2>
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

    <!-- Inovasi Dapur Pintar (Pembaruan TA): Smart Pantry & Hands-Free Mode -->
    <section class="ta-novelty-section">
      <div class="container">
        <div class="novelty-banner-card">
          <div class="novelty-header">
            <span class="novelty-kicker">✨ Inovasi Dapur Cerdas</span>
            <h2 class="novelty-title">Pembaruan Teknologi Memasak Modern</h2>
            <p class="novelty-desc">
              CookBook menghadirkan terobosan mutakhir untuk menjawab permasalahan dapur nyata: dari rekomendasi bahan kulkas seadanya hingga memasak tanpa menyentuh layar!
            </p>
          </div>

          <div class="novelty-grid">
            <!-- Card 1: Smart Pantry -->
            <div class="novelty-item-box">
              <div class="box-icon">🧊</div>
              <div class="box-content">
                <span class="box-tag">Algoritma Jaccard Similarity</span>
                <h3>Smart Pantry Matcher</h3>
                <p>
                  Bingung mau masak apa dengan isi kulkasmu? Masukkan bahan yang tersedia, sistem menghitung persentase kecocokan resep secara cerdas.
                </p>
                <RouterLink to="/pantry" class="novelty-link-btn">
                  Buka Kulkas Pintar &rarr;
                </RouterLink>
              </div>
            </div>

            <!-- Card 2: Voice Assistant -->
            <div class="novelty-item-box">
              <div class="box-icon">🎙️</div>
              <div class="box-content">
                <span class="box-tag">Web Speech Recognition &amp; TTS</span>
                <h3>Hands-Free Voice Assistant</h3>
                <p>
                  Tangan kotor kena bumbu atau basah? Ikuti panduan resep langkah demi langkah menggunakan perintah suara tanpa sentuh layar HP.
                </p>
                <RouterLink to="/recipes/rendang-daging-sapi" class="novelty-link-btn secondary">
                  Coba Demo Suara di Resep &rarr;
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
            <span class="feature-emoji">⚖️</span>
            <h3>Takaran Akurat &amp; Teruji</h3>
            <p>Setiap resep telah diuji di dapur keluarga dengan takaran pas agar tidak gagal.</p>
          </div>
          <div class="feature-item">
            <span class="feature-emoji">📋</span>
            <h3>Langkah Interaktif</h3>
            <p>Checklist bahan masakan dan panduan memasak urut dari awal hingga matang.</p>
          </div>
          <div class="feature-item">
            <span class="feature-emoji">❤️</span>
            <h3>Simpan Resep Favorit</h3>
            <p>Tandai resep kesukaanmu dengan satu klik dan akses kapan saja tanpa ribet.</p>
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
            <p>Temukan ratusan ide masakan sehari-hari dari sarapan praktis hingga hidangan pesta istimewa.</p>
          </div>
          <div class="cta-buttons">
            <RouterLink to="/recipes" class="btn btn-primary">
              Buka Katalog Resep
            </RouterLink>
            <RouterLink to="/about" class="btn btn-secondary">
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
  padding-bottom: 4rem;
}

/* Hero */
.hero-section {
  padding: 3.5rem 0 4.5rem;
  background: radial-gradient(circle at 10% 20%, #fff7ed 0%, #fdfbf7 70%);
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
  background-color: #fff2ed;
  border: 1px solid var(--primary-border);
  color: var(--primary);
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-full);
  font-size: 0.84rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: 2.85rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
}

.highlight-text {
  color: var(--primary);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 540px;
}

/* Hero Search */
.hero-search-box {
  width: 100%;
  max-width: 540px;
  background: var(--bg-surface);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  padding: 0.4rem 0.5rem 0.4rem 1.25rem;
  box-shadow: var(--shadow-md);
  transition: all 0.25s ease;
  margin-bottom: 1.25rem;
}

.hero-search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 6px 20px rgba(217, 72, 20, 0.15);
}

.search-icon {
  font-size: 1.2rem;
  margin-right: 0.65rem;
  opacity: 0.7;
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
  color: var(--text-light);
}

.search-submit-btn {
  padding: 0.7rem 1.4rem;
}

/* Quick pills */
.quick-keywords {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.25rem;
  font-size: 0.85rem;
}

.keywords-label {
  color: var(--text-light);
  font-weight: 500;
}

.keyword-pill {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  color: var(--text-main);
  transition: all 0.2s ease;
}

.keyword-pill:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-border);
  color: var(--primary);
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
}

.stat-label {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 34px;
  background-color: var(--border-light);
}

/* Hero Visual Banner */
.hero-banner-visual {
  position: relative;
}

.visual-card-wrap {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(45, 30, 20, 0.14);
  border: 4px solid #ffffff;
}

.visual-hero-img {
  width: 100%;
  height: 440px;
  object-fit: cover;
  display: block;
}

.floating-recipe-card {
  position: absolute;
  bottom: 24px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.float-icon {
  background-color: #fef3c7;
  color: #b45309;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
}

.float-info {
  flex-grow: 1;
}

.float-info h4 {
  font-size: 0.78rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.float-info p {
  font-size: 0.95rem;
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
  font-size: 1.1rem;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.float-btn:hover {
  transform: scale(1.1);
}

/* Sections */
.categories-section,
.featured-recipes-section {
  padding: 4.5rem 0 2rem;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 0.35rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Features */
.features-section {
  padding: 3rem 0;
  margin-top: 2rem;
}

.features-inner {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
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

.feature-emoji {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.feature-item p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.55;
}

/* CTA */
.cta-banner-section {
  padding: 3rem 0 1rem;
}

.cta-banner-card {
  background: linear-gradient(135deg, #d94814 0%, #b83609 100%);
  color: white;
  border-radius: 24px;
  padding: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 12px 30px rgba(217, 72, 20, 0.25);
  flex-wrap: wrap;
}

.cta-text h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.cta-text p {
  color: #ffddd3;
  font-size: 1.05rem;
  max-width: 600px;
}

.cta-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-buttons .btn-primary {
  background: white;
  color: var(--primary);
}

.cta-buttons .btn-primary:hover {
  background: #fff5f2;
}

.cta-buttons .btn-secondary {
  background: transparent;
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}

.cta-buttons .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  color: white;
}

/* TA Novelty Showcase Section */
.ta-novelty-section {
  padding: 3rem 0;
}

.novelty-banner-card {
  background: linear-gradient(145deg, #26211c, #1a1613);
  border: 1px solid rgba(234, 88, 12, 0.3);
  border-radius: var(--radius-lg);
  padding: 3rem;
  color: #f7f4ee;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

.novelty-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 2.5rem auto;
}

.novelty-kicker {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ea580c;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.novelty-title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  color: #ffffff;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

.novelty-desc {
  font-size: 0.98rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.novelty-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.novelty-item-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  transition: all 0.25s ease;
}

.novelty-item-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(234, 88, 12, 0.6);
  transform: translateY(-4px);
}

.box-icon {
  font-size: 2.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.box-content {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.box-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fb923c;
  background: rgba(234, 88, 12, 0.2);
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  width: fit-content;
}

.box-content h3 {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  color: #ffffff;
  font-weight: 700;
}

.box-content p {
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.5;
}

.novelty-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #ea580c;
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.novelty-link-btn:hover {
  color: #fed7aa;
  transform: translateX(4px);
}

.novelty-link-btn.secondary {
  color: #38bdf8;
}

.novelty-link-btn.secondary:hover {
  color: #bae6fd;
}

@media (max-width: 992px) {
  .novelty-grid {
    grid-template-columns: 1fr;
  }

  .novelty-banner-card {
    padding: 2rem 1.5rem;
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
    font-size: 2.2rem;
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
