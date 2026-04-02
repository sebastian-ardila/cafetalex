import { useState } from 'react'
import {
  Beef,
  UtensilsCrossed,
  Popcorn,
  Coffee,
  Snowflake,
  GlassWater,
  Leaf,
  Vegan,
  Wine,
  Martini,
  Beer,
  IceCreamCone,
  Cake,
  CakeSlice,
  Cookie,
  Egg,
  Citrus,
  Milk,
  Candy,
  Droplets,
} from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { categories, menuItems } from '../../data/menu'
import ProductCard from './ProductCard'
import './MenuSection.css'

const categoryIcons: Record<string, typeof Coffee> = {
  burgers: Beef,
  food: UtensilsCrossed,
  snacks: Popcorn,
  hotEspresso: Coffee,
  hotCoffeeMilk: Milk,
  hotMilkNoCoffee: Candy,
  coldCoffee: Snowflake,
  coldNoCoffee: GlassWater,
  herbalTea: Leaf,
  coffeeLiquor: GlassWater,
  cocktails: Martini,
  wines: Wine,
  micheladas: Citrus,
  beers: Beer,
  bottled: Droplets,
  iceCream: IceCreamCone,
  cakes: Cake,
  coldCakes: CakeSlice,
  cookies: Cookie,
  breakfast: Egg,
}

export default function MenuSection() {
  const { t, lang } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')

  const isVegFilter = activeCategory === 'vegetarian'

  const baseItems = isVegFilter
    ? menuItems.filter((item) => item.vegetarian)
    : activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  const grouped = activeCategory === 'all'
  const categoryGroups = grouped
    ? categories
        .map((cat) => ({
          ...cat,
          items: menuItems.filter((item) => item.category === cat.id),
        }))
        .filter((g) => g.items.length > 0)
    : isVegFilter
      ? categories
          .map((cat) => ({
            ...cat,
            items: baseItems.filter((item) => item.category === cat.id),
          }))
          .filter((g) => g.items.length > 0)
      : []

  return (
    <section id="menu-section" className="menu-section">
      <div className="container">
        <div className="page-header">
          <h2>{t('menuSection.title')}</h2>
          <p>{t('menuSection.subtitle')}</p>
        </div>

        <div className="category-filters">
          <button
            className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <UtensilsCrossed size={14} />
            {t('menuSection.all')}
          </button>
          <button
            className={`filter-pill filter-pill-veg ${activeCategory === 'vegetarian' ? 'active' : ''}`}
            onClick={() => setActiveCategory('vegetarian')}
          >
            <Vegan size={14} />
            {lang === 'es' ? 'Vegetariano' : 'Vegetarian'}
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Coffee
            return (
              <button
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={14} />
                {lang === 'es' ? cat.nameEs : cat.nameEn}
              </button>
            )
          })}
        </div>

        {grouped || isVegFilter ? (
          categoryGroups.map((group) => {
            const Icon = categoryIcons[group.id] || Coffee
            return (
              <div key={group.id} className="category-group">
                <h3 className="category-title">
                  <Icon size={20} />
                  {lang === 'es' ? group.nameEs : group.nameEn}
                </h3>
                <div className="products-grid">
                  {group.items.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="products-grid">
            {baseItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
