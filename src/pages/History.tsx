import { Link } from 'react-router-dom'
import { UtensilsCrossed, CalendarCheck } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import './Pages.css'

export default function History() {
  const { t } = useTranslation()

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>{t('history.title')}</h1>
          <p>{t('history.subtitle')}</p>
        </div>

        <div className="history-content">
          {t('history.content')
            .split('\n\n')
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>

        <div className="card cta-card">
          <h3>{t('history.ctaTitle')}</h3>
          <p>{t('history.ctaText')}</p>
          <div className="cta-card-buttons">
            <Link to="/" className="btn btn-primary">
              <UtensilsCrossed size={18} />
              {t('history.ctaButton')}
            </Link>
            <Link to="/reservations" className="btn btn-outline">
              <CalendarCheck size={18} />
              {t('history.ctaReserve')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
