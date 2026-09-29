import type { Recipe } from '../types/recipe'
import { recipesData } from '../data/recipesData'

export interface PantryIngredientPreset {
  id: string
  name: string
  category: 'bumbu' | 'protein' | 'karbo' | 'sayur' | 'pelengkap'
  icon: string
}

export interface RecipeMatchResult {
  recipe: Recipe
  // Persentase pemenuhan bahan resep (Berapa % bahan resep yang sudah dimiliki pengguna)
  matchPercentage: number
  // Jaccard Similarity Coefficient: |A ∩ B| / |A ∪ B|
  jaccardSimilarity: number
  // Bahan yang dimiliki pengguna dan cocok dengan resep
  matchedIngredients: string[]
  // Bahan resep yang belum dimiliki (butuh beli/kurang)
  missingIngredients: string[]
  // Apakah 100% bahan tersedia
  isReadyToCook: boolean
}

// Koleksi bahan pangan populer rumah tangga Indonesia
export const POPULAR_PANTRY_PRESETS: PantryIngredientPreset[] = [
  // Protein
  { id: 'telur', name: 'Telur Ayam', category: 'protein', icon: '🥚' },
  { id: 'ayam', name: 'Daging Ayam', category: 'protein', icon: '🍗' },
  { id: 'sapi', name: 'Daging Sapi', category: 'protein', icon: '🥩' },
  { id: 'tahu', name: 'Tahu Putih', category: 'protein', icon: '🧈' },
  { id: 'tempe', name: 'Tempe', category: 'protein', icon: '🍢' },
  { id: 'udang', name: 'Udang', category: 'protein', icon: '🦐' },

  // Karbohidrat
  { id: 'nasi', name: 'Nasi Putih', category: 'karbo', icon: '🍚' },
  { id: 'mie', name: 'Mie Telur', category: 'karbo', icon: '🍜' },
  { id: 'spaghetti', name: 'Pasta Spaghetti', category: 'karbo', icon: '🍝' },
  { id: 'kentang', name: 'Kentang', category: 'karbo', icon: '🥔' },
  { id: 'tepung', name: 'Tepung Terigu', category: 'karbo', icon: '🌾' },

  // Bumbu & Rempah
  { id: 'bawang-merah', name: 'Bawang Merah', category: 'bumbu', icon: '🧅' },
  { id: 'bawang-putih', name: 'Bawang Putih', category: 'bumbu', icon: '🧄' },
  { id: 'cabai', name: 'Cabai Rawit / Merah', category: 'bumbu', icon: '🌶️' },
  { id: 'kecap-manis', name: 'Kecap Manis', category: 'bumbu', icon: '🍶' },
  { id: 'saus-tiram', name: 'Saus Tiram', category: 'bumbu', icon: '🫙' },
  { id: 'garam', name: 'Garam & Lada', category: 'bumbu', icon: '🧂' },
  { id: 'jahe', name: 'Jahe / Lengkuas', category: 'bumbu', icon: '🫚' },
  { id: 'kunyit', name: 'Kunyit Bubuk', category: 'bumbu', icon: '✨' },
  { id: 'serai', name: 'Serai & Salam', category: 'bumbu', icon: '🌿' },

  // Sayur & Pelengkap
  { id: 'daun-bawang', name: 'Daun Bawang / Seledri', category: 'sayur', icon: '🌱' },
  { id: 'tomat', name: 'Tomat', category: 'sayur', icon: '🍅' },
  { id: 'wortel', name: 'Wortel', category: 'sayur', icon: '🥕' },
  { id: 'santan', name: 'Santan Kelapa', category: 'pelengkap', icon: '🥥' },
  { id: 'susu', name: 'Susu Cair / UHT', category: 'pelengkap', icon: '🥛' },
  { id: 'mentega', name: 'Mentega / Margarin', category: 'pelengkap', icon: '🧈' },
  { id: 'keju', name: 'Keju Cheddar / Mozzarella', category: 'pelengkap', icon: '🧀' }
]

const STORAGE_KEY = 'cookbook_user_pantry_items'

export function getSavedPantry(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Error reading pantry from storage', e)
  }
  // Default rekomendasi awal: bahan pokok paling sering ada di rumah
  return ['Telur Ayam', 'Nasi Putih', 'Bawang Merah', 'Bawang Putih', 'Kecap Manis']
}

export function savePantry(items: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Error saving pantry to storage', e)
  }
}

/**
 * Normalisasi kata bahan untuk pencocokan semantik dasar
 * Contoh: "Daging Ayam Fillet" -> token ['daging', 'ayam']
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['butir', 'buah', 'sendok', 'siung', 'secukupnya', 'gram', 'potong', 'cangkir', 'lembar'].includes(w))
}

/**
 * Cek apakah bahan resep cocok dengan salah satu bahan kulkas pengguna
 */
function isIngredientMatched(recipeIngName: string, userIngredients: string[]): boolean {
  const recipeTokens = tokenize(recipeIngName)
  if (recipeTokens.length === 0) return false

  return userIngredients.some((userIng) => {
    const userTokens = tokenize(userIng)
    // Cocok jika ada kata kunci pokok yang beririsan
    return userTokens.some((uToken) => recipeTokens.some((rToken) => rToken.includes(uToken) || uToken.includes(rToken)))
  })
}

/**
 * Menghitung kecocokan resep berdasarkan daftar bahan pengguna
 * Mengimplementasikan Formula Evaluasi Ilmiah:
 * 1. Recipe Coverage Ratio = |User ∩ Recipe| / |Recipe|
 * 2. Jaccard Similarity Index = |User ∩ Recipe| / |User ∪ Recipe|
 */
export function calculateRecipeMatch(userIngredients: string[], recipe: Recipe): RecipeMatchResult {
  const matched: string[] = []
  const missing: string[] = []

  recipe.ingredients.forEach((ing) => {
    if (isIngredientMatched(ing.name, userIngredients)) {
      matched.push(ing.name)
    } else {
      missing.push(ing.name)
    }
  })

  const totalRecipeIngredients = recipe.ingredients.length
  const matchedCount = matched.length

  // Recipe Fulfillment / Coverage Ratio (Persentase kelengkapan resep)
  const matchPercentage = totalRecipeIngredients > 0
    ? Math.round((matchedCount / totalRecipeIngredients) * 100)
    : 0

  // Jaccard Similarity Coefficient:
  // J(A, B) = |A ∩ B| / |A ∪ B|
  // di mana |A ∪ B| = |A| + |B| - |A ∩ B|
  const userCount = userIngredients.length
  const unionCount = userCount + totalRecipeIngredients - matchedCount
  const jaccardSimilarity = unionCount > 0 ? Number((matchedCount / unionCount).toFixed(2)) : 0

  return {
    recipe,
    matchPercentage,
    jaccardSimilarity,
    matchedIngredients: matched,
    missingIngredients: missing,
    isReadyToCook: matchedCount === totalRecipeIngredients
  }
}

/**
 * Mengambil semua resep yang dicocokkan dengan bahan pengguna dan diurutkan
 */
export function matchRecipesWithPantry(userIngredients: string[]): RecipeMatchResult[] {
  if (!userIngredients || userIngredients.length === 0) {
    return recipesData.map((recipe) => ({
      recipe,
      matchPercentage: 0,
      jaccardSimilarity: 0,
      matchedIngredients: [],
      missingIngredients: recipe.ingredients.map((i) => i.name),
      isReadyToCook: false
    }))
  }

  const results = recipesData.map((recipe) => calculateRecipeMatch(userIngredients, recipe))

  // Urutkan berdasarkan:
  // 1. matchPercentage tertinggi
  // 2. jaccardSimilarity tertinggi
  // 3. rating resep tertinggi
  return results.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage
    }
    if (b.jaccardSimilarity !== a.jaccardSimilarity) {
      return b.jaccardSimilarity - a.jaccardSimilarity
    }
    return b.recipe.rating - a.recipe.rating
  })
}
