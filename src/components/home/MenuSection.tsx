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
  const [showFixed, setShowFixed] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const filtersRef = useRef<HTMLDivElement>(null)
  const fixedRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  // Show fixed bar when original filters scroll out above the navbar
  useEffect(() => {
    const onScroll = () => {
      const el = filtersRef.current
      if (!el) return
      const navbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64
      const rect = el.getBoundingClientRect()
      // Show fixed when the bottom of original filters goes above the navbar
      setShowFixed(rect.bottom < navbarH)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Clear active pill when on the hero (filters not fixed)
  useEffect(() => {
    if (!showFixed) setActiveId('')
  }, [showFixed])

  // Track which category section is visible
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

  // Auto-scroll fixed bar to show active pill
  const scrollActivePillIntoView = useCallback(() => {
    if (!showFixed || !activeId || !fixedRef.current) return
    const pill = fixedRef.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement
    if (pill) pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [showFixed, activeId])

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
      const fixedH = fixedRef.current?.offsetHeight || 100
      const y = el.getBoundingClientRect().top + window.scrollY - navbarH - fixedH - 16
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setTimeout(() => { isScrollingRef.current = false }, 1000)
  }

  // Pill definitions ordered: row1 starts with burgers, row2 starts with veg+breakfast
  const allPillDefs = useMemo(() => {
    const catPills = categories.map((cat) => ({ id: cat.id, labelEs: cat.nameEs, labelEn: cat.nameEn, isVeg: false }))
    const veg = { id: 'vegetarian', labelEs: 'Vegetariano', labelEn: 'Vegetarian', isVeg: true }
    const breakfast = catPills.find((c) => c.id === 'breakfast')!
    const rest = catPills.filter((c) => c.id !== 'breakfast')
    const rc = typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 2
    const perRow = Math.ceil((rest.length + 2) / rc)
    const row1 = rest.slice(0, perRow)
    const remaining = rest.slice(perRow)
    return [...row1, veg, breakfast, ...remaining]
  }, [])

  const rowCount = typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 2
  const perRow = Math.ceil(allPillDefs.length / rowCount)
  const rows: typeof allPillDefs[] = []
  for (let i = 0; i < allPillDefs.length; i += perRow) {
    rows.push(allPillDefs.slice(i, i + perRow))
  }

  const renderRows = () =>
    rows.map((row, ri) => (
      <div key={ri} className="filters-row">
        {row.map((def) => {
          const Icon = categoryIcons[def.id] || Coffee
          return (
            <button
              key={def.id}
              data-cat={def.id}
              className={`filter-pill ${def.isVeg ? 'filter-pill-veg' : ''} ${activeId === def.id ? 'active' : ''}`}
              onClick={() => scrollToCategory(def.id)}
            >
              <Icon size={14} />
              {lang === 'es' ? def.labelEs : def.labelEn}
            </button>
          )
        })}
      </div>
    ))

  return (
    <section id="menu-section" className="menu-section">
      <div className="container">
        <div className="page-header">
          <h2>{t('menuSection.title')}</h2>
          <p>{t('menuSection.subtitle')}</p>
        </div>

        {/* Original filters — always in normal document flow */}
        <div ref={filtersRef} className="category-filters">
          <div className="filters-inner">
            {renderRows()}
          </div>
        </div>

        {/* Fixed clone — appears when original scrolls out */}
        {showFixed && (
          <div ref={fixedRef} className="category-filters category-filters--fixed">
            <div className="filters-inner">
              {renderRows()}
            </div>
          </div>
        )}

        {allPillDefs.map((def) => {
          const Icon = categoryIcons[def.id] || Coffee
          const items = def.id === 'vegetarian'
            ? vegetarianItems
            : categoryGroups.find((g) => g.id === def.id)?.items || []
          if (items.length === 0) return null
          const label = lang === 'es' ? def.labelEs : def.labelEn
          return (
            <div key={def.id} id={`cat-${def.id}`} className="category-group">
              <h3 className="category-title">
                <Icon size={20} />
                {label}
              </h3>
              <div className="products-grid">
                {items.map((item) => (
                  <ProductCard key={`${def.id}-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
