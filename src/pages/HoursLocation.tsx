import { Link } from 'react-router-dom'
import { Clock, MapPin, Navigation, CalendarCheck, MessageCircle, Truck } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import { openWhatsApp } from '../utils/whatsapp'
import './Pages.css'

export default function HoursLocation() {
  const { t } = useTranslation()

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

        <div className="cta-buttons">
          <Link to="/reservations" className="btn btn-primary">
            <CalendarCheck size={18} />
            {t('hours.reserveTable')}
          </Link>
          <button
            className="btn btn-outline"
            onClick={() => openWhatsApp('Hola Cafetalex! Quiero hacer un pedido')}
          >
            <MessageCircle size={18} />
            {t('hours.orderWhatsApp')}
          </button>
        </div>
      </div>
    </main>
  )
}
