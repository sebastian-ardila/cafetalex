import { useState, useRef, useEffect, useMemo } from 'react'
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
  const [isStuck, setIsStuck] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const filtersRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  // Detect when filters are stuck at top of scroll container
  useEffect(() => {
    const scrollRoot = document.getElementById('scroll-root')
    if (!scrollRoot) return
    const onScroll = () => {
      const el = filtersRef.current
      if (!el) return
      const containerTop = scrollRoot.getBoundingClientRect().top
      const rect = el.getBoundingClientRect()
      setIsStuck(rect.top <= containerTop + 1)
    }
    scrollRoot.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scrollRoot.removeEventListener('scroll', onScroll)
  }, [])

  // Clear active pill when not stuck (viewing hero area)
  useEffect(() => {
    if (!isStuck) setActiveId('')
  }, [isStuck])

  // Track which category section is visible
  useEffect(() => {
    const scrollRoot = document.getElementById('scroll-root')
    if (!scrollRoot) return
    const filtersH = filtersRef.current?.offsetHeight || 100
    const offset = filtersH + 40
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace('cat-', ''))
          }
        }
      },
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0, root: scrollRoot }
    )
    allCatIds.forEach((id) => {
      const el = document.getElementById(`cat-${id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Auto-scroll filters to show active pill
  useEffect(() => {
    if (!isStuck || !activeId || !filtersRef.current) return
    const pill = filtersRef.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement
    if (pill) pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [isStuck, activeId])

  const vegetarianItems = menuItems.filter((item) => item.vegetarian)
  const categoryGroups = categories
    .map((cat) => ({ ...cat, items: menuItems.filter((item) => item.category === cat.id) }))
    .filter((g) => g.items.length > 0)

  const scrollToCategory = (id: string) => {
    isScrollingRef.current = true
    setActiveId(id)
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const scrollRoot = document.getElementById('scroll-root')
      if (!scrollRoot) return
      const filtersH = filtersRef.current?.offsetHeight || 100
      const y = el.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + scrollRoot.scrollTop - filtersH - 16
      scrollRoot.scrollTo({ top: y, behavior: 'smooth' })
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

  return (
    <section id="menu-section" className="menu-section">
      <div className="container">
        <div className="page-header">
          <h2>{t('menuSection.title')}</h2>
          <p>{t('menuSection.subtitle')}</p>
        </div>

        {/* Sticky category filters */}
        <div
          ref={filtersRef}
          className={`category-filters${isStuck ? ' category-filters--stuck' : ''}`}
        >
          <div className="filters-inner">
            {rows.map((row, ri) => (
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
            ))}
          </div>
        </div>

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
