import menuData from './menu.json'

export interface Ingredient {
  emoji: string
  es: string
  en: string
}

export interface OptionChoice {
  id: string
  nameEs: string
  nameEn: string
  priceAdd: number
}

export interface OptionStep {
  stepEs: string
  stepEn: string
  type: 'select' | 'addon'
  required: boolean
  choices: OptionChoice[]
}

export interface MenuItem {
  id: string
  category: string
  nameEs: string
  nameEn: string
  price: number
  noteEs?: string
  noteEn?: string
  ingredients: Ingredient[]
  options?: OptionStep[]
  badges?: { es: string; en: string }[]
  vegetarian?: boolean
}

export interface Category {
  id: string
  nameEs: string
  nameEn: string
  icon: string
}

export const categories: Category[] = menuData.categories
export const menuItems: MenuItem[] = menuData.items as MenuItem[]
