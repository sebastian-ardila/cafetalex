import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  UtensilsCrossed,
  MapPin,
  BookOpen,
  Mail,
  CalendarCheck,
  ShoppingCart,
  Menu,
  X,
  Globe,
} from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useCartStore } from '../../store/cartStore'
import './Navbar.css'

const navLinks = [
  { to: '/', icon: UtensilsCrossed, labelKey: 'nav.menu' },
  { to: '/hours', icon: MapPin, labelKey: 'nav.hours' },
  { to: '/history', icon: BookOpen, labelKey: 'nav.history' },
  { to: '/contact', icon: Mail, labelKey: 'nav.contact' },
  { to: '/reservations', icon: CalendarCheck, labelKey: 'nav.reservations' },
]

export default function Navbar() {
  const { t, lang, setLang } = useTranslation()
  const location = useLocation()
  const openCart = useCartStore((s) => s.openCart)
  const cartCount = useCartStore((s) => s.getCount())
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-logo">
            <img src={import.meta.env.BASE_URL + 'cafetalex-logo.webp'} alt="Cafetalex" />
          </Link>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                <link.icon size={16} />
                <span>{t(link.labelKey)}</span>
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            >
              <Globe size={16} />
              <span>{lang === 'es' ? 'EN' : 'ES'}</span>
            </button>

            <button className="cart-btn" onClick={openCart}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu-inner">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-menu-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <link.icon size={22} />
                <span>{t(link.labelKey)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
