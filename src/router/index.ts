import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // 1. Entry Point / Beranda Utama
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'CookBook - Resep Masakan Sederhana & Lezat'
      }
    },

    // 2. Hubungan Parent-Child: Modul Resep
    {
      path: '/recipes',
      component: () => import('../views/recipes/RecipesLayout.vue'),
      children: [
        {
          path: '',
          name: 'recipes',
          component: () => import('../views/recipes/RecipesListView.vue'),
          meta: {
            title: 'Jelajah Resep Masakan - CookBook'
          }
        },
        {
          path: ':id',
          name: 'recipe-detail',
          component: () => import('../views/recipes/RecipeDetailView.vue'),
          meta: {
            title: 'Detail Resep - CookBook'
          }
        }
      ]
    },

    // 3. Hubungan Parent-Child: Modul Kategori
    {
      path: '/categories',
      component: () => import('../views/categories/CategoriesLayout.vue'),
      children: [
        {
          path: '',
          name: 'categories',
          component: () => import('../views/categories/CategoriesListView.vue'),
          meta: {
            title: 'Kategori Masakan - CookBook'
          }
        },
        {
          path: ':slug',
          name: 'category-detail',
          component: () => import('../views/categories/CategoryDetailView.vue'),
          meta: {
            title: 'Daftar Resep Kategori - CookBook'
          }
        }
      ]
    },

    // 4. Inovasi TA: Smart Pantry Matcher (Kulkas Pintar)
    {
      path: '/pantry',
      name: 'pantry',
      component: () => import('../views/PantryMatcherView.vue'),
      meta: {
        title: 'Smart Pantry Kulkas & Rekomendasi - CookBook'
      }
    },

    // 5. Destinasi Utama: Resep Favorit
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: {
        title: 'Koleksi Resep Favorit - CookBook'
      }
    },

    // 5. Destinasi Utama: Tips Dapur & Tentang CookBook
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'Tips Dapur & Tentang - CookBook'
      }
    },

    // 6. Jalur Fallback: 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: 'Halaman Tidak Ditemukan - CookBook'
      }
    }
  ]
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = String(to.meta.title)
  }
})

export default router
