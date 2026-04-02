import { useState, useRef, useEffect } from 'react'
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
  vegetarian: Vegan,
}

export default function MenuSection() {
  const { t, lang } = useTranslation()
  const [isSticky, setIsSticky] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--navbar-h').trim() || '64px'} 0px 0px 0px` }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const vegetarianItems = menuItems.filter((item) => item.vegetarian)

  const categoryGroups = categories
    .map((cat) => ({
      ...cat,
      items: menuItems.filter((item) => item.category === cat.id),
    }))
    .filter((g) => g.items.length > 0)

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const navbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64
      const stickyH = 120
      const y = el.getBoundingClientRect().top + window.scrollY - navbarH - stickyH
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // All nav pills: vegetarian + categories
  const allPillDefs = [
    { id: 'vegetarian', labelEs: 'Vegetariano', labelEn: 'Vegetarian', isVeg: true },
    ...categories.map((cat) => ({ id: cat.id, labelEs: cat.nameEs, labelEn: cat.nameEn, isVeg: false })),
  ]

  const renderPills = (inSticky: boolean) => {
    const pills = allPillDefs.map((def) => {
      const Icon = categoryIcons[def.id] || Coffee
      return (
        <button
          key={def.id}
          className={`filter-pill ${def.isVeg ? 'filter-pill-veg' : ''}`}
          onClick={() => scrollToCategory(def.id)}
        >
          <Icon size={14} />
          {lang === 'es' ? def.labelEs : def.labelEn}
        </button>
      )
    })

    if (!inSticky) return pills

    const rowCount = window.innerWidth <= 768 ? 3 : 2
    const perRow = Math.ceil(pills.length / rowCount)
    const rows: typeof pills[] = []
    for (let i = 0; i < pills.length; i += perRow) {
      rows.push(pills.slice(i, i + perRow))
    }
    return (
      <div className="filters-inner">
        {rows.map((row, i) => (
          <div key={i} className="filters-row">{row}</div>
        ))}
      </div>
    )
  }

  return (
    <section id="menu-section" className="menu-section">
      <div className="container">
        <div className="page-header">
          <h2>{t('menuSection.title')}</h2>
          <p>{t('menuSection.subtitle')}</p>
        </div>

        <div ref={sentinelRef} className="filters-sentinel" />

        <div className={`category-filters ${isSticky ? 'category-filters--sticky' : ''}`}>
          {renderPills(isSticky)}
        </div>

        {/* Vegetarian section */}
        {vegetarianItems.length > 0 && (
          <div id="cat-vegetarian" className="category-group">
            <h3 className="category-title">
              <Vegan size={20} />
              {lang === 'es' ? 'Vegetariano' : 'Vegetarian'}
            </h3>
            <div className="products-grid">
              {vegetarianItems.map((item) => (
                <ProductCard key={`veg-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* All category sections */}
        {categoryGroups.map((group) => {
          const Icon = categoryIcons[group.id] || Coffee
          return (
            <div key={group.id} id={`cat-${group.id}`} className="category-group">
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
        })}
      </div>
    </section>
  )
}
