<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Breadcrumb from '../components/common/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Tips Dapur & Tentang' }
]

const activeTab = ref<'conversion' | 'storage' | 'faq'>('conversion')
</script>

<template>
  <div class="about-page container fade-in">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Tips Dapur &amp; Tentang CookBook</h1>
        <p class="page-subtitle">
          Panduan praktis memasak, tabel konversi takaran bahan, dan wawasan dapur untuk membantu Anda memasak lebih percaya diri.
        </p>
      </div>
    </div>

    <!-- Navigation Tabs for Tips -->
    <div class="tabs-nav-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'conversion' }"
        @click="activeTab = 'conversion'"
      >
        <span>⚖️ Tabel Konversi Takaran</span>
      </button>

      <button
        class="tab-btn"
        :class="{ active: activeTab === 'storage' }"
        @click="activeTab = 'storage'"
      >
        <span>🌿 Tips Menyimpan Bahan</span>
      </button>

      <button
        class="tab-btn"
        :class="{ active: activeTab === 'faq' }"
        @click="activeTab = 'faq'"
      >
        <span>❓ FAQ &amp; Tentang CookBook</span>
      </button>
    </div>

    <!-- Tab 1: Conversion Table -->
    <section v-if="activeTab === 'conversion'" class="tab-content fade-in">
      <div class="info-card">
        <h2 class="card-heading">Tabel Konversi Sendok ke Gram &amp; Mililiter</h2>
        <p class="card-intro">
          Tidak punya timbangan digital di rumah? Gunakan panduan takaran sendok standar berikut:
        </p>

        <div class="table-responsive">
          <table class="conversion-table">
            <thead>
              <tr>
                <th>Bahan Masakan</th>
                <th>1 Sendok Teh (sdt)</th>
                <th>1 Sendok Makan (sdm)</th>
                <th>1 Cangkir / Gelas Belimbing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Air / Susu Cair / Santan</strong></td>
                <td>5 ml</td>
                <td>15 ml</td>
                <td>240 ml</td>
              </tr>
              <tr>
                <td><strong>Tepung Terigu / Maizena</strong></td>
                <td>3 gram</td>
                <td>10 gram</td>
                <td>120 gram</td>
              </tr>
              <tr>
                <td><strong>Gula Pasir</strong></td>
                <td>4 gram</td>
                <td>14 gram</td>
                <td>200 gram</td>
              </tr>
              <tr>
                <td><strong>Mentega / Margarin</strong></td>
                <td>5 gram</td>
                <td>15 gram</td>
                <td>220 gram</td>
              </tr>
              <tr>
                <td><strong>Garam Halus</strong></td>
                <td>5 gram</td>
                <td>15 gram</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="oven-temp-box">
          <h3>🔥 Konversi Suhu Oven Sederhana</h3>
          <div class="temp-grid">
            <div class="temp-item">
              <span class="temp-label">Api Kecil / Rendah</span>
              <span class="temp-val">150°C ~ 300°F</span>
            </div>
            <div class="temp-item">
              <span class="temp-label">Api Sedang</span>
              <span class="temp-val">180°C ~ 350°F</span>
            </div>
            <div class="temp-item">
              <span class="temp-label">Api Tinggi / Panas</span>
              <span class="temp-val">200°C - 220°C ~ 400°F</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tab 2: Storage Tips -->
    <section v-if="activeTab === 'storage'" class="tab-content fade-in">
      <div class="tips-grid">
        <div class="tip-box">
          <span class="tip-icon">🧄</span>
          <h3>Menyimpan Bumbu Dasar Halus</h3>
          <p>
            Setelah bumbu putih/kuning/merah dihaluskan, tumis dengan minyak hingga benar-benar matang dan minyaknya terpisah. Simpan di toples kaca tertutup dalam chiller agar awet hingga 1 bulan.
          </p>
        </div>

        <div class="tip-box">
          <span class="tip-icon">🥩</span>
          <h3>Mengempukkan Daging Sapi</h3>
          <p>
            Potong daging sapi berlawanan arah serat. Untuk olahan tumis atau rendang cepat empuk, lumuri dengan sedikit parutan nanas muda atau daun pepaya remas selama 10-15 menit sebelum dimasak.
          </p>
        </div>

        <div class="tip-box">
          <span class="tip-icon">🥬</span>
          <h3>Menjaga Sayuran Hijau Tetap Segar</h3>
          <p>
            Jangan mencuci sayuran sebelum disimpan di kulkas jika belum akan dimasak. Bungkus sayuran dengan kertas koran atau tisu tebal di dalam wadah kedap udara untuk menyerap kelembapan berlebih.
          </p>
        </div>

        <div class="tip-box">
          <span class="tip-icon">🐟</span>
          <h3>Menghilangkan Bau Amis Ikan</h3>
          <p>
            Lumuri ikan segar dengan perasan jeruk nipis/lemon dan sedikit garam, lalu diamkan 10 menit. Bilas bersih kembali sebelum dibumbui agar rasa masakan tidak terlalu asam.
          </p>
        </div>
      </div>
    </section>

    <!-- Tab 3: FAQ & About CookBook -->
    <section v-if="activeTab === 'faq'" class="tab-content fade-in">
      <div class="info-card">
        <h2 class="card-heading">Tentang Aplikasi CookBook</h2>
        <p class="card-intro">
          <strong>CookBook</strong> adalah aplikasi web buku resep masakan yang dirancang dengan antarmuka yang bersih, intuitif, dan responsif menggunakan framework Vue.js modern.
        </p>

        <div class="faq-list">
          <div class="faq-item">
            <h4>🍳 Apakah resep di CookBook bisa disimpan?</h4>
            <p>
              Ya! Anda dapat menekan tombol bookmark/hati (❤️) di setiap kartu resep atau di halaman detail resep. Resep favorit akan tersimpan otomatis di perangkat Anda via <code>localStorage</code>.
            </p>
          </div>

          <div class="faq-item">
            <h4>⚖️ Apakah porsi bahan bisa disesuaikan?</h4>
            <p>
              Bisa! Pada halaman detail resep, gunakan tombol <strong>+ / -</strong> pada bagian pengatur porsi. Takaran semua bahan akan dikalkulasi ulang secara dinamis sesuai jumlah porsi yang Anda butuhkan.
            </p>
          </div>

          <div class="faq-item">
            <h4>🗺️ Bagaimana struktur navigasi sitemap aplikasi ini?</h4>
            <p>
              Aplikasi ini memiliki 1 beranda utama, 5 destinasi utama (Beranda, Jelajah Resep, Kategori, Favorit, Tips Dapur), hubungan Parent-Child pada modul Resep (<code>/recipes</code> &rarr; <code>/recipes/:id</code>) dan modul Kategori (<code>/categories</code> &rarr; <code>/categories/:slug</code>), serta breadcrumb di setiap level.
            </p>
          </div>
        </div>

        <div class="about-cta-box">
          <h3>Siap Menemukan Menu Masakan Hari Ini?</h3>
          <RouterLink to="/recipes" class="btn btn-primary">
            Jelajah Koleksi Resep Lengkap &rarr;
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  padding-bottom: 5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
}

.page-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 680px;
}

/* Tabs */
.tabs-nav-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.75rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--primary-border);
  color: var(--primary);
}

.tab-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(217, 72, 20, 0.2);
}

/* Card */
.info-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.card-heading {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.card-intro {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 0.96rem;
}

/* Conversion Table */
.table-responsive {
  overflow-x: auto;
  margin-bottom: 2.5rem;
}

.conversion-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
}

.conversion-table th {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  padding: 1rem 1.25rem;
  border-bottom: 2px solid var(--border-light);
  font-weight: 700;
}

.conversion-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-muted);
}

.conversion-table tr:hover td {
  background-color: #fdfaf6;
}

/* Oven Box */
.oven-temp-box {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.oven-temp-box h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.temp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.temp-item {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.temp-label {
  font-size: 0.78rem;
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: 700;
}

.temp-val {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--primary);
  margin-top: 0.25rem;
}

/* Tips Grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tip-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
}

.tip-icon {
  font-size: 2.2rem;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.tip-box h3 {
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
}

.tip-box p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.faq-item {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
}

.faq-item h4 {
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
  color: var(--text-main);
}

.faq-item p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.about-cta-box {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
}

.about-cta-box h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
</style>
