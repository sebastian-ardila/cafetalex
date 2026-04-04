import { useNavigate } from 'react-router-dom'
import { setSkipScrollTop } from '../components/layout/ScrollToTop'
import { Clock, MapPin, Navigation, UtensilsCrossed, CalendarCheck, Truck } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import './Pages.css'

export default function HoursLocation() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>{t('hours.title')}</h1>
          <p>{t('hours.subtitle')}</p>
        </div>

        <section className="section">
          <h2 className="section-title">
            <Navigation size={22} />
            {t('hours.howToGet')}
          </h2>
          <div className="directions-btns">
            <a
              href="https://www.waze.com/es/live-map/directions/co/risaralda/pereira/cafetalex-tienda-de-cafe-and-restaurante?to=place.ChIJeW2YPE-HOI4R-ao8R5AnOh0"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <Navigation size={18} />
              {t('hours.openWaze')}
            </a>
            <a
              href="https://maps.app.goo.gl/Nhjwon2q9AYCrmW47?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <MapPin size={18} />
              {t('hours.openGoogleMaps')}
            </a>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            <Clock size={22} />
            {t('hours.schedule')}
          </h2>
          <div className="schedule-cards">
            <div className="card schedule-card">
              <span className="schedule-label">{t('hours.monSat')}</span>
              <span className="schedule-value">{t('hours.monSatHours')}</span>
            </div>
            <div className="card schedule-card closed">
              <span className="schedule-label">{t('hours.sunHolidays')}</span>
              <span className="schedule-value">{t('hours.closed')}</span>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            <MapPin size={22} />
            {t('hours.location')}
          </h2>
          <div className="card location-card">
            <p className="location-address">{t('hours.address')}</p>
            <p className="location-delivery">
              <Truck size={16} />
              {t('hours.deliveryNote')}
            </p>
          </div>
        </section>

        <div className="card cta-card">
          <h3>{t('history.ctaTitle')}</h3>
          <p>{t('history.ctaText')}</p>
          <div className="cta-card-buttons">
            <button onClick={() => { setSkipScrollTop(); navigate('/'); setTimeout(() => (() => { const el = document.getElementById('menu-section'); const sr = document.getElementById('scroll-root'); if (el && sr) { const y = el.getBoundingClientRect().top - sr.getBoundingClientRect().top + sr.scrollTop; sr.scrollTo({ top: y, behavior: 'smooth' }) } })(), 100) }} className="btn btn-primary">
              <UtensilsCrossed size={18} />
              {t('history.ctaButton')}
            </button>
            <button onClick={() => navigate('/reservations')} className="btn btn-outline">
              <CalendarCheck size={18} />
              {t('history.ctaReserve')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
