import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useTranslation } from '../../i18n/useTranslation'
import './CartFab.css'

export default function CartFab() {
  const count = useCartStore((s) => s.getCount())
  const openCart = useCartStore((s) => s.openCart)
  const { t } = useTranslation()

  if (count === 0) return null

  return (
    <button className="cart-fab" onClick={openCart}>
      <ShoppingCart size={18} />
      <span>{t('cart.title')}</span>
      <span className="cart-fab-badge">{count}</span>
    </button>
  )
}
