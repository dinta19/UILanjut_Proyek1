export interface Ingredient {
  name: string
  amount: number
  unit: string
  notes?: string
}

export interface CookingStep {
  stepNumber: number
  title: string
  instruction: string
  durationMinutes?: number
  tip?: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  image: string
  recipeCount?: number
}

export interface Recipe {
  id: string
  slug: string
  title: string
  categorySlug: string
  categoryName: string
  description: string
  image: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  totalTimeMinutes: number
  servings: number
  difficulty: 'Mudah' | 'Sedang' | 'Mahir'
  rating: number
  reviewsCount: number
  isFeatured?: boolean
  caloriesPerServing: number
  chefName: string
  origin: string
  ingredients: Ingredient[]
  steps: CookingStep[]
  tips: string[]
}
