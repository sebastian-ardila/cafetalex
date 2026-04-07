import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setSkipScrollTop } from '../layout/ScrollToTop'
import { X, ArrowLeft, Trash2, UtensilsCrossed, CalendarCheck } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { MdTableRestaurant } from 'react-icons/md'
import { useTranslation } from '../../i18n/useTranslation'
import { useCartStore } from '../../store/cartStore'
import { useTable } from '../../context/TableContext'
import { openWhatsApp, formatCOP } from '../../utils/whatsapp'
import CartItem from './CartItem'
import './CartDrawer.css'

export default function CartDrawer() {
  const { t, lang } = useTranslation()
  const { items, isOpen, step, closeCart, setStep, clear, getTotal } = useCartStore()
  const { tableNumber: urlTable, hasTable: hasUrlTable } = useTable()
  const total = getTotal()

  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [payment, setPayment] = useState('')
  const [orderType, setOrderType] = useState('')
  const [localTable, setLocalTable] = useState('')
  const [address, setAddress] = useState('')
  const [tried, setTried] = useState(false)

  // Auto-fill table from URL only when first selecting dineIn
  const [tableCleared, setTableCleared] = useState(false)

  useEffect(() => {
    if (orderType === 'dineIn' && hasUrlTable && !localTable && !tableCleared) {
      setLocalTable(urlTable)
    }
  }, [orderType, hasUrlTable, urlTable, localTable, tableCleared])

  if (!isOpen) return null

  const handleOrderType = (type: string) => {
    setOrderType(type)
    if (type === 'dineIn' && hasUrlTable) {
      setLocalTable(urlTable)
    } else if (type === 'delivery') {
      setLocalTable('')
    }
  }

  const nameInvalid = tried && !name.trim()
  const paymentInvalid = tried && !payment
  const orderTypeInvalid = tried && !orderType
  const tableInvalid = tried && orderType === 'dineIn' && !localTable
  const addressInvalid = tried && orderType === 'delivery' && !address.trim()
  const hasErrors = !name.trim() || !payment || !orderType
    || (orderType === 'dineIn' && !localTable)
    || (orderType === 'delivery' && !address.trim())

  const itemLinePrice = (item: typeof items[0]) => {
    const selAdd = item.selections.reduce((s, sel) => s + sel.priceAdd, 0)
    return (item.price + selAdd) * item.qty
  }

  const handleSendWhatsApp = () => {
    setTried(true)
    if (hasErrors) return

    const paymentLabel =
      payment === 'transfer'
        ? t('cart.transfer')
        : payment === 'card'
          ? t('cart.card')
          : t('cart.cash')

    const orderTypeLabel =
      orderType === 'dineIn' ? t('cart.dineIn') : t('cart.delivery')

    const locationLine = orderType === 'dineIn'
      ? `📍 En mesa\n🪑 Mesa ${localTable}`
      : `📍 Domicilio\n🏠 ${address}`

    const itemLines = items
      .map((item) => {
        const itemName = lang === 'es' ? item.nameEs : item.nameEn
        const selsText = item.selections
          .map((s) => (lang === 'es' ? s.nameEs : s.nameEn))
          .join(', ')
        const detail = selsText ? ` (${selsText})` : ''
        return `${item.qty}x ${itemName}${detail} ${formatCOP(itemLinePrice(item))}`
      })
      .join('\n')

    const message = `Hola Cafetalex! Quiero hacer un pedido

Nombre: ${name}
Tipo: ${orderTypeLabel}
${locationLine}
Pago: ${paymentLabel}

Pedido:
${itemLines}

Total: ${formatCOP(total)}`

    openWhatsApp(message)
  }

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          {step === 2 && (
            <button className="cart-back" onClick={() => { setStep(1); setTried(false) }}>
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
                    onClick={() => { closeCart(); setSkipScrollTop(); navigate('/'); setTimeout(() => (() => { const el = document.getElementById('menu-section'); const sr = document.getElementById('scroll-root'); if (el && sr) { const y = el.getBoundingClientRect().top - sr.getBoundingClientRect().top + sr.scrollTop; sr.scrollTo({ top: y, behavior: 'smooth' }) } })(), 100) }}
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
                  className={`form-control${nameInvalid ? ' field-error' : ''}`}
                  placeholder={t('cart.customerNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {nameInvalid && <span className="error-msg">{t('cart.nameRequired')}</span>}
              </div>

              <div className="form-group">
                <label className={paymentInvalid ? 'label-error' : ''}>{t('cart.paymentMethod')}</label>
                <div className={`radio-group${paymentInvalid ? ' group-error' : ''}`}>
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
                {paymentInvalid && <span className="error-msg">{t('cart.paymentRequired')}</span>}
              </div>

              <div className="form-group">
                <label className={orderTypeInvalid ? 'label-error' : ''}>{t('cart.orderType')}</label>
                <div className={`radio-group${orderTypeInvalid ? ' group-error' : ''}`}>
                  {(['dineIn', 'delivery'] as const).map((opt) => (
                    <div className="radio-option" key={opt}>
                      <input
                        type="radio"
                        id={`type-${opt}`}
                        name="orderType"
                        checked={orderType === opt}
                        onChange={() => handleOrderType(opt)}
                      />
                      <label htmlFor={`type-${opt}`}>{t(`cart.${opt}`)}</label>
                    </div>
                  ))}
                </div>
                {orderTypeInvalid && <span className="error-msg">{t('cart.orderTypeRequired')}</span>}
              </div>

              {/* Table selection for dineIn */}
              {orderType === 'dineIn' && (
                <div className="form-group">
                  {localTable ? (
                    <div className="cart-table-indicator">
                      <MdTableRestaurant size={20} />
                      <span className="cart-table-label">
                        {lang === 'en' ? 'Table' : 'Mesa'}
                      </span>
                      <span className="cart-table-number">{localTable}</span>
                      <button
                        className="cart-table-change"
                        onClick={() => { setLocalTable(''); setTableCleared(true) }}
                      >
                        {lang === 'en' ? 'Change' : 'Cambiar'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className={tableInvalid ? 'label-error' : ''}>
                        {lang === 'en' ? 'Table number' : 'Número de mesa'}
                      </label>
                      <div className={`cart-table-grid${tableInvalid ? ' group-error' : ''}`}>
                        {Array.from({ length: 20 }, (_, i) => String(i + 1)).map((n) => (
                          <button
                            key={n}
                            className="cart-table-btn"
                            onClick={() => { setLocalTable(n); setTableCleared(false) }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      {tableInvalid && <span className="error-msg">
                        {lang === 'en' ? 'Select a table' : 'Selecciona una mesa'}
                      </span>}
                    </>
                  )}
                </div>
              )}

              {/* Address for delivery */}
              {orderType === 'delivery' && (
                <div className="form-group">
                  <label className={addressInvalid ? 'label-error' : ''}>
                    {lang === 'en' ? 'Delivery address' : 'Dirección de entrega'}
                  </label>
                  <input
                    type="text"
                    className={`form-control${addressInvalid ? ' field-error' : ''}`}
                    placeholder={lang === 'en' ? 'Enter your address' : 'Ingresa tu dirección'}
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {addressInvalid && <span className="error-msg">
                    {lang === 'en' ? 'Enter your address' : 'Ingresa tu dirección'}
                  </span>}
                </div>
              )}

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
                className={`btn btn-primary btn-block${hasErrors ? ' btn-disabled-look' : ''}`}
                onClick={handleSendWhatsApp}
              >
                <FaWhatsapp size={18} />
                {t('cart.sendWhatsApp')}
              </button>
              {tried && hasErrors && (
                <p className="form-error-summary">{t('cart.requiredFields')}</p>
              )}
              <button
                className="btn btn-outline btn-block btn-sm"
                onClick={() => { setStep(1); setTried(false) }}
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
