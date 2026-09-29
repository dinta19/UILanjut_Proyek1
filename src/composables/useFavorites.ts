import { ref, computed } from 'vue'
import { recipesData } from '../data/recipesData'
import type { Recipe } from '../types/recipe'

const STORAGE_KEY = 'cookbook_favorites'

// Shared state across all component instances
const favoriteIds = ref<string[]>(loadFavorites())

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to load favorites from localStorage', err)
  }
  // Default sample favorites if empty
  return ['rendang-daging-sapi', 'matcha-burnt-cheesecake']
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err)
  }
}

export function useFavorites() {
  const isFavorite = (recipeId: string): boolean => {
    return favoriteIds.value.includes(recipeId)
  }

  const toggleFavorite = (recipeId: string) => {
    const index = favoriteIds.value.indexOf(recipeId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
    } else {
      favoriteIds.value.push(recipeId)
    }
    saveFavorites()
  }

  const favoriteCount = computed(() => favoriteIds.value.length)

  const favoriteRecipes = computed<Recipe[]>(() => {
    return recipesData.filter((recipe) => favoriteIds.value.includes(recipe.id))
  })

  return {
    favoriteIds,
    favoriteCount,
    favoriteRecipes,
    isFavorite,
    toggleFavorite
  }
}
