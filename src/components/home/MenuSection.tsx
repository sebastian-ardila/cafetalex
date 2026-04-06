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
  ShoppingBag,
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
  shop: ShoppingBag,
  vegetarian: Vegan,
}

const allCatIds = ['vegetarian', ...categories.map((c) => c.id)]

function getScrollRoot(): HTMLElement {
  return document.getElementById('scroll-root') || document.documentElement
}

export default function MenuSection() {
  const { t, lang } = useTranslation()
  const [activeId, setActiveId] = useState<string | null>(null)
  const stickyBarRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const isScrollingRef = useRef(false)

  // Scroll-spy: detect active category via scroll position (not IntersectionObserver)
  useEffect(() => {
    const scrollRoot = getScrollRoot()
    const rafId = { current: 0 }

    const onScroll = () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        if (isScrollingRef.current) return

        const barH = stickyBarRef.current?.offsetHeight ?? 100
        const rootTop = scrollRoot.getBoundingClientRect().top
        const detectionLine = rootTop + barH + 60

        // Check if menu section is in view
        const menuEl = document.getElementById('menu-section')
        if (menuEl) {
          const menuRect = menuEl.getBoundingClientRect()
          if (menuRect.bottom < rootTop || menuRect.top > rootTop + scrollRoot.clientHeight) {
            setActiveId(null)
            return
          }
        }

        // Find section whose top is closest to (but above) the detection line
        let best: string | null = null
        let bestTop = -Infinity

        for (const id of allCatIds) {
          const el = document.getElementById(`cat-${id}`)
          if (!el) continue
          const top = el.getBoundingClientRect().top
          if (top <= detectionLine && top > bestTop) {
            bestTop = top
            best = id
          }
        }

        setActiveId(best)
      })
    }

    scrollRoot.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      scrollRoot.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  // Auto-scroll pill bar horizontally — only when pill is out of view
  useEffect(() => {
    if (!activeId) return
    const btn = pillRefs.current.get(activeId)
    const container = stickyBarRef.current
    if (!btn || !container) return

    const bRect = btn.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()

    if (bRect.left < cRect.left || bRect.right > cRect.right) {
      const pillLeft = btn.offsetLeft
      const pillWidth = btn.offsetWidth
      const containerWidth = container.clientWidth
      container.scrollTo({
        left: pillLeft - containerWidth / 2 + pillWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [activeId])

  const vegetarianItems = menuItems.filter((item) => item.vegetarian)
  const categoryGroups = categories
    .map((cat) => ({ ...cat, items: menuItems.filter((item) => item.category === cat.id) }))
    .filter((g) => g.items.length > 0)

  const scrollToCategory = useCallback((id: string) => {
    isScrollingRef.current = true
    setActiveId(id)

    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const scrollRoot = getScrollRoot()
      const rootTop = scrollRoot.getBoundingClientRect().top
      const barH = stickyBarRef.current?.offsetHeight ?? 100
      const y = el.getBoundingClientRect().top - rootTop + scrollRoot.scrollTop - barH - 16
      scrollRoot.scrollTo({ top: y, behavior: 'smooth' })
    }

    setTimeout(() => { isScrollingRef.current = false }, 1000)
  }, [])

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
        <div ref={stickyBarRef} className="category-filters">
          <div className="filters-inner">
            {rows.map((row, ri) => (
              <div key={ri} className="filters-row">
                {row.map((def) => {
                  const Icon = categoryIcons[def.id] || Coffee
                  return (
                    <button
                      key={def.id}
                      ref={(el) => { if (el) pillRefs.current.set(def.id, el); else pillRefs.current.delete(def.id) }}
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
