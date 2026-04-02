import { useState } from 'react'
import { Eye, Plus, Minus, X, ShoppingCart, Check } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useCartStore, type Selection } from '../../store/cartStore'
import { formatCOP } from '../../utils/whatsapp'
import type { MenuItem } from '../../data/menu'
import './ProductCard.css'

interface Props {
  item: MenuItem
}

export default function ProductCard({ item }: Props) {
  const { t, lang } = useTranslation()
  const { addItem, updateQty, items } = useCartStore()
  const [showModal, setShowModal] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showVariants, setShowVariants] = useState(false)
  const [selections, setSelections] = useState<Record<number, string>>({})

  const name = lang === 'es' ? item.nameEs : item.nameEn
  const note = lang === 'es' ? item.noteEs : item.noteEn
  const hasOptions = item.options && item.options.length > 0

  const matchingItems = items.filter((i) => i.id === item.id)
  const totalQty = matchingItems.reduce((s, i) => s + i.qty, 0)

  const ingredientText = item.ingredients
    .map((ing) => `${ing.emoji} ${lang === 'es' ? ing.es : ing.en}`)
    .join(', ')

  const handleAdd = () => {
    if (hasOptions) {
      const defaults: Record<number, string> = {}
      item.options!.forEach((step, idx) => {
        if (step.defaultChoice) defaults[idx] = step.defaultChoice
      })
      setShowOptions(true)
      setShowVariants(false)
      setSelections(defaults)
    } else {
      addItem({ id: item.id, nameEs: item.nameEs, nameEn: item.nameEn, price: item.price, selections: [] })
    }
  }

  const handleConfirmOptions = () => {
    const sels: Selection[] = []
    item.options!.forEach((step, idx) => {
      const choiceId = selections[idx]
      if (choiceId && choiceId !== step.defaultChoice) {
        const choice = step.choices.find((c) => c.id === choiceId)
        if (choice) {
          sels.push({ choiceId: choice.id, nameEs: choice.nameEs, nameEn: choice.nameEn, priceAdd: choice.priceAdd })
        }
      }
    })
    addItem({ id: item.id, nameEs: item.nameEs, nameEn: item.nameEn, price: item.price, selections: sels })
    setShowOptions(false)
    setSelections({})
  }

  const canConfirm = () => {
    if (!item.options) return true
    return item.options.every((step, idx) => !step.required || !!selections[idx])
  }

  const dynamicPrice = () => {
    let total = item.price
    item.options?.forEach((step, idx) => {
      const choice = step.choices.find((c) => c.id === selections[idx])
      if (choice) total += choice.priceAdd
    })
    return total
  }

  const toggleAddon = (stepIdx: number, choiceId: string) => {
    setSelections((prev) => {
      if (prev[stepIdx] === choiceId) {
        const next = { ...prev }
        delete next[stepIdx]
        return next
      }
      return { ...prev, [stepIdx]: choiceId }
    })
  }

  return (
    <>
      <div className="product-card card">
        <div className="product-img-placeholder">
          <ShoppingCart size={28} />
          {totalQty > 0 && <span className="product-card-badge">{totalQty}</span>}
          <div className="product-info-badges">
            {item.vegetarian && (
              <span className="info-badge veg-badge">🌱 {lang === 'es' ? 'Vegetariano' : 'Vegetarian'}</span>
            )}
            {item.badges?.map((b, i) => (
              <span key={i} className="info-badge">{lang === 'es' ? b.es : b.en}</span>
            ))}
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-ingredients">{ingredientText}</p>
          {note && <p className="product-note">{note}</p>}
          <p className="product-price">{formatCOP(item.price)}</p>
        </div>

        <div className="product-actions">
          <button className="btn btn-sm btn-outline" onClick={() => setShowModal(true)}>
            <Eye size={14} />
            {t('menuSection.viewDish')}
          </button>
          {totalQty > 0 && !hasOptions ? (
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => updateQty(matchingItems[0].cartKey, matchingItems[0].qty - 1)}>
                <Minus size={14} />
              </button>
              <span className="qty-value">{totalQty}</span>
              <button className="qty-btn" onClick={handleAdd}>
                <Plus size={14} />
              </button>
            </div>
          ) : totalQty > 0 && hasOptions ? (
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => setShowVariants(true)}>
                <Minus size={14} />
              </button>
              <span className="qty-value">{totalQty}</span>
              <button className="qty-btn" onClick={handleAdd}>
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={handleAdd}>
              <Plus size={14} />
              {t('menuSection.addToCart')}
            </button>
          )}
        </div>

        {/* Overlay: option selection */}
        {showOptions && item.options && (
          <div className="product-overlay">
            <button className="overlay-close" onClick={() => { setShowOptions(false); setSelections({}) }}>
              <X size={16} />
            </button>
            {item.options.map((step, idx) => (
              <div key={idx} className="option-step">
                <p className="option-label">
                  {lang === 'es' ? step.stepEs : step.stepEn}
                  {step.required && <span className="option-required">*</span>}
                </p>
                <div className="option-choices">
                  {step.choices.map((choice) => {
                    const choiceName = lang === 'es' ? choice.nameEs : choice.nameEn
                    const isSelected = selections[idx] === choice.id
                    return (
                      <button
                        key={choice.id}
                        className={`option-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => step.type === 'addon' ? toggleAddon(idx, choice.id) : setSelections((p) => ({ ...p, [idx]: choice.id }))}
                      >
                        {isSelected && <Check size={10} />}
                        {choiceName}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="overlay-footer">
              <span className="option-total">{formatCOP(dynamicPrice())}</span>
              <button className="btn btn-sm btn-primary" onClick={handleConfirmOptions} disabled={!canConfirm()}>
                <Check size={12} />
                {t('menuSection.addToCart')}
              </button>
            </div>
          </div>
        )}

        {/* Overlay: variant management (remove items) */}
        {showVariants && hasOptions && matchingItems.length > 0 && (
          <div className="product-overlay">
            <button className="overlay-close" onClick={() => setShowVariants(false)}>
              <X size={16} />
            </button>
            <p className="option-label" style={{ marginBottom: 8 }}>
              {lang === 'es' ? 'Tu pedido' : 'Your order'}
            </p>
            {matchingItems.map((ci) => {
              const selsLabel = ci.selections.map((s) => (lang === 'es' ? s.nameEs : s.nameEn)).join(' + ')
              return (
                <div key={ci.cartKey} className="variant-row">
                  <span className="variant-label">{selsLabel || name}</span>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => {
                      updateQty(ci.cartKey, ci.qty - 1)
                      if (ci.qty <= 1) {
                        const remaining = matchingItems.filter(m => m.cartKey !== ci.cartKey)
                        if (remaining.length === 0) setShowVariants(false)
                      }
                    }}>
                      <Minus size={12} />
                    </button>
                    <span className="qty-value">{ci.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(ci.cartKey, ci.qty + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
            <div className="variant-add-btn">
              <button className="btn btn-sm btn-primary btn-block" onClick={handleAdd}>
                <Plus size={12} />
                {lang === 'es' ? 'Agregar otro' : 'Add another'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="product-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="product-modal card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <div className="product-img-placeholder modal-img">
              <ShoppingCart size={40} />
            </div>
            <h2>{name}</h2>
            <p className="product-price modal-price">{formatCOP(item.price)}</p>
            {note && <p className="product-note">{note}</p>}
            <div className="modal-ingredients">
              {item.ingredients.map((ing, i) => (
                <span key={i} className="ingredient-tag">
                  {ing.emoji} {lang === 'es' ? ing.es : ing.en}
                </span>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => { setShowModal(false); handleAdd() }}>
                <Plus size={16} />
                {t('menuSection.addToCart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
