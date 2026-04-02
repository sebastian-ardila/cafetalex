import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
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

const allCatIds = ['vegetarian', ...categories.map((c) => c.id)]

export default function MenuSection() {
  const { t, lang } = useTranslation()
  const [isSticky, setIsSticky] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const sentinelRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

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

  useEffect(() => {
    const navbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64
    const offset = navbarH + 160
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace('cat-', ''))
          }
        }
      },
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
    )
    allCatIds.forEach((id) => {
      const el = document.getElementById(`cat-${id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollActivePillIntoView = useCallback(() => {
    if (!isSticky || !activeId) return
    const container = stickyRef.current
    if (!container) return
    const pill = container.querySelector(`[data-cat="${activeId}"]`) as HTMLElement
    if (pill) {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [isSticky, activeId])

  useEffect(() => { scrollActivePillIntoView() }, [scrollActivePillIntoView])

  const vegetarianItems = menuItems.filter((item) => item.vegetarian)
  const categoryGroups = categories
    .map((cat) => ({ ...cat, items: menuItems.filter((item) => item.category === cat.id) }))
    .filter((g) => g.items.length > 0)

  const scrollToCategory = (id: string) => {
    isScrollingRef.current = true
    setActiveId(id)
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const navbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64
      const stickyH = 140
      const y = el.getBoundingClientRect().top + window.scrollY - navbarH - stickyH
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setTimeout(() => { isScrollingRef.current = false }, 1000)
  }

  // Order pills so row 1 starts with Hamburguesas, row 2 starts with Vegetariano + Desayunos
  const allPillDefs = useMemo(() => {
    const catPills = categories.map((cat) => ({ id: cat.id, labelEs: cat.nameEs, labelEn: cat.nameEn, isVeg: false }))
    const veg = { id: 'vegetarian', labelEs: 'Vegetariano', labelEn: 'Vegetarian', isVeg: true }
    const breakfast = catPills.find((c) => c.id === 'breakfast')!
    const rest = catPills.filter((c) => c.id !== 'breakfast')

    const rowCount = typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 2
    const total = rest.length + 2 // +2 for veg and breakfast
    const perRow = Math.ceil(total / rowCount)

    // Row 1: first N categories (starts with burgers)
    const row1 = rest.slice(0, perRow)
    // Row 2+: vegetariano, desayunos corporativos, then remaining
    const remaining = rest.slice(perRow)
    const row2on = [veg, breakfast, ...remaining]

    return [...row1, ...row2on]
  }, [])

  const rowCount = typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 2
  const perRow = Math.ceil(allPillDefs.length / rowCount)
  const rows: typeof allPillDefs[] = []
  for (let i = 0; i < allPillDefs.length; i += perRow) {
    rows.push(allPillDefs.slice(i, i + perRow))
  }

  return (
    <section id="menu-section" className="menu-section">
      <div className="container">
        <div className="page-header">
          <h2>{t('menuSection.title')}</h2>
          <p>{t('menuSection.subtitle')}</p>
        </div>

        <div ref={sentinelRef} className="filters-sentinel" />

        <div
          ref={stickyRef}
          className={`category-filters ${isSticky ? 'category-filters--sticky' : ''}`}
        >
          <div className="filters-inner">
            {rows.map((row, ri) => (
              <div key={ri} className="filters-row">
                {row.map((def) => {
                  const Icon = categoryIcons[def.id] || Coffee
                  const isActive = activeId === def.id
                  return (
                    <button
                      key={def.id}
                      data-cat={def.id}
                      className={`filter-pill ${def.isVeg ? 'filter-pill-veg' : ''} ${isActive ? 'active' : ''}`}
                      onClick={() => scrollToCategory(def.id)}
                    >
                      <Icon size={14} />
                      {lang === 'es' ? def.labelEs : def.labelEn}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

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
