<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found-page container fade-in">
    <div class="not-found-card">
      <div class="error-badge">404 Error</div>
      <div class="emoji-icon">🍲💥</div>
      <h1 class="error-title">Waduh! Halaman Tidak Ditemukan</h1>
      <p class="error-desc">
        Sepertinya resep atau halaman yang Anda tuju sedang tidak tersedia di dapur CookBook atau tautan URL salah ketik.
      </p>

      <div class="action-buttons">
        <RouterLink to="/" class="btn btn-primary">
          🏠 Kembali ke Beranda
        </RouterLink>
        <RouterLink to="/recipes" class="btn btn-secondary">
          📖 Jelajah Semua Resep
        </RouterLink>
      </div>

      <div class="quick-links-hint">
        <span>Atau coba akses halaman utama:</span>
        <div class="links-row">
          <RouterLink to="/categories">Kategori</RouterLink>
          <span>•</span>
          <RouterLink to="/favorites">Favorit</RouterLink>
          <span>•</span>
          <RouterLink to="/about">Tips Dapur</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  padding: 4rem 1.5rem 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 250px);
}

.not-found-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 28px;
  padding: 3.5rem 2.5rem;
  text-align: center;
  max-width: 580px;
  width: 100%;
  box-shadow: var(--shadow-md);
}

.error-badge {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  margin-bottom: 1.5rem;
}

.emoji-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.error-desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.quick-links-hint {
  font-size: 0.88rem;
  color: var(--text-light);
  border-top: 1px dashed var(--border-light);
  padding-top: 1.5rem;
}

.links-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 600;
  color: var(--text-muted);
}

.links-row a {
  color: var(--primary);
}

.links-row a:hover {
  text-decoration: underline;
}
</style>
