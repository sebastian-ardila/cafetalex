import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  UtensilsCrossed,
  MapPin,
  BookOpen,
  Mail,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import './Breadcrumb.css'

const routeConfig: Record<string, { labelKey: string; icon: typeof Home }> = {
  '/': { labelKey: 'nav.menu', icon: UtensilsCrossed },
  '/hours': { labelKey: 'nav.hours', icon: MapPin },
  '/history': { labelKey: 'nav.history', icon: BookOpen },
  '/contact': { labelKey: 'nav.contact', icon: Mail },
  '/reservations': { labelKey: 'nav.reservations', icon: CalendarCheck },
}

export default function Breadcrumb() {
  const { t } = useTranslation()
  const location = useLocation()

  if (location.pathname === '/') return null

  const route = routeConfig[location.pathname]
  if (!route) return null

  const Icon = route.icon

  return (
    <div className="breadcrumb">
      <div className="breadcrumb-inner container">
        <Link to="/" className="breadcrumb-link">
          <Home size={14} />
          <span>{t('breadcrumb.home')}</span>
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current">
          <Icon size={14} />
          <span>{t(route.labelKey)}</span>
        </span>
      </div>
    </div>
  )
}
