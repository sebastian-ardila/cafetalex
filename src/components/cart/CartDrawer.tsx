import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowLeft, MessageCircle, Trash2, UtensilsCrossed, CalendarCheck } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useCartStore } from '../../store/cartStore'
import { openWhatsApp, formatCOP } from '../../utils/whatsapp'
import CartItem from './CartItem'
import './CartDrawer.css'

export default function CartDrawer() {
  const { t, lang } = useTranslation()
  const { items, isOpen, step, closeCart, setStep, clear, getTotal } = useCartStore()
  const total = getTotal()

  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [payment, setPayment] = useState('cash')
  const [orderType, setOrderType] = useState('dineIn')

  if (!isOpen) return null

  const itemLinePrice = (item: typeof items[0]) => {
    const selAdd = item.selections.reduce((s, sel) => s + sel.priceAdd, 0)
    return (item.price + selAdd) * item.qty
  }

  const handleSendWhatsApp = () => {
    const paymentLabel =
      payment === 'transfer'
        ? t('cart.transfer')
        : payment === 'card'
          ? t('cart.card')
          : t('cart.cash')

    const orderTypeLabel =
      orderType === 'dineIn' ? t('cart.dineIn') : t('cart.delivery')

    const itemLines = items
      .map((item) => {
        const itemName = lang === 'es' ? item.nameEs : item.nameEn
        const selsText = item.selections
          .map((s) => (lang === 'es' ? s.nameEs : s.nameEn))
          .join(', ')
        const detail = selsText ? ` (${selsText})` : ''
        return `☕ ${item.qty}x ${itemName}${detail} ${formatCOP(itemLinePrice(item))}`
      })
      .join('\n')

    const message = `👋 Hola Cafetalex! Quiero hacer un pedido

👤 Nombre: ${name || 'No especificado'}
🍽️ Tipo: ${orderTypeLabel}
💳 Pago: ${paymentLabel}

📋 Pedido:
${itemLines}

💰 Total: ${formatCOP(total)}`

    openWhatsApp(message)
  }

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          {step === 2 && (
            <button className="cart-back" onClick={() => setStep(1)}>
              <ArrowLeft size={18} />
            </button>
          )}
          <h3>{t('cart.title')}</h3>
          <button className="cart-close" onClick={closeCart}>
            <X size={20} />
          </button>
        </div>

        {step === 1 ? (
          <>
            <div className="cart-body">
              {items.length === 0 ? (
                <div className="cart-empty">
                <p>{t('cart.empty')}</p>
                <div className="cart-empty-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => { closeCart(); navigate('/'); setTimeout(() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
                  >
                    <UtensilsCrossed size={16} />
                    {t('hero.viewMenu')}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => { closeCart(); navigate('/reservations') }}
                  >
                    <CalendarCheck size={16} />
                    {t('hero.reserveTable')}
                  </button>
                </div>
              </div>
              ) : (
                <div className="cart-items">
                  {items.map((item) => (
                    <CartItem key={item.cartKey} item={item} />
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>{t('cart.total')}</span>
                  <span className="cart-total-value">{formatCOP(total)}</span>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setStep(2)}
                >
                  {t('cart.continue')}
                </button>
                <button className="btn btn-danger btn-block btn-sm" onClick={clear}>
                  <Trash2 size={14} />
                  {t('cart.deleteOrder')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="cart-body">
            <div className="cart-step2">
              <div className="form-group">
                <label>{t('cart.customerName')}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('cart.customerNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>{t('cart.paymentMethod')}</label>
                <div className="radio-group">
                  {(['transfer', 'card', 'cash'] as const).map((opt) => (
                    <div className="radio-option" key={opt}>
                      <input
                        type="radio"
                        id={`pay-${opt}`}
                        name="payment"
                        checked={payment === opt}
                        onChange={() => setPayment(opt)}
                      />
                      <label htmlFor={`pay-${opt}`}>{t(`cart.${opt}`)}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>{t('cart.orderType')}</label>
                <div className="radio-group">
                  {(['dineIn', 'delivery'] as const).map((opt) => (
                    <div className="radio-option" key={opt}>
                      <input
                        type="radio"
                        id={`type-${opt}`}
                        name="orderType"
                        checked={orderType === opt}
                        onChange={() => setOrderType(opt)}
                      />
                      <label htmlFor={`type-${opt}`}>{t(`cart.${opt}`)}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary card">
                <h4>{t('cart.orderSummary')}</h4>
                {items.map((item) => {
                  const selsText = item.selections
                    .map((s) => (lang === 'es' ? s.nameEs : s.nameEn))
                    .join(' + ')
                  return (
                    <div key={item.cartKey} className="summary-line">
                      <div>
                        <span>{item.qty}x {lang === 'es' ? item.nameEs : item.nameEn}</span>
                        {selsText && <span className="summary-sels">{selsText}</span>}
                      </div>
                      <span>{formatCOP(itemLinePrice(item))}</span>
                    </div>
                  )
                })}
                <div className="summary-total">
                  <span>{t('cart.total')}</span>
                  <span>{formatCOP(total)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={handleSendWhatsApp}
              >
                <MessageCircle size={18} />
                {t('cart.sendWhatsApp')}
              </button>
              <button
                className="btn btn-outline btn-block btn-sm"
                onClick={() => setStep(1)}
              >
                {t('cart.back')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
