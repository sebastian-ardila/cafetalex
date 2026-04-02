import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore, type CartItem as CartItemType } from '../../store/cartStore'
import { useLangStore } from '../../i18n/useTranslation'
import { formatCOP } from '../../utils/whatsapp'
import './CartItem.css'

interface Props {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { updateQty, removeItem } = useCartStore()
  const lang = useLangStore((s) => s.lang)
  const name = lang === 'es' ? item.nameEs : item.nameEn

  const selAdd = item.selections.reduce((s, sel) => s + sel.priceAdd, 0)
  const unitPrice = item.price + selAdd
  const lineTotal = unitPrice * item.qty

  const selectionsText = item.selections
    .map((s) => (lang === 'es' ? s.nameEs : s.nameEn))
    .join(' + ')

  return (
    <div className="cart-item">
      <div className="cart-item-top">
        <div className="cart-item-info">
          <span className="cart-item-name">{name}</span>
          {selectionsText && (
            <span className="cart-item-selections">{selectionsText}</span>
          )}
        </div>
        <button className="cart-item-remove" onClick={() => removeItem(item.cartKey)}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className="cart-item-bottom">
        <div className="qty-controls">
          <button className="qty-btn" onClick={() => updateQty(item.cartKey, item.qty - 1)}>
            <Minus size={14} />
          </button>
          <span className="qty-value">{item.qty}</span>
          <button className="qty-btn" onClick={() => updateQty(item.cartKey, item.qty + 1)}>
            <Plus size={14} />
          </button>
        </div>
        <div className="cart-item-pricing">
          {item.qty > 1 && (
            <span className="cart-item-unit">{formatCOP(unitPrice)} c/u</span>
          )}
          <span className="cart-item-price">{formatCOP(lineTotal)}</span>
        </div>
      </div>
    </div>
  )
}
