import {
  Instagram,
  Facebook,
  MapPin,
  Navigation,
  MessageCircle,
  Star,
} from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-main container">
        <div className="footer-col">
          <img
            src={import.meta.env.BASE_URL + 'cafetalex-logo.webp'}
            alt="Cafetalex"
            className="footer-logo"
          />
          <p className="footer-tagline">{t('footer.tagline')}</p>
          <p className="footer-address">
            <MapPin size={14} />
            Calle 21 bis #17B-03, La Lorena, Pereira
          </p>
          <p className="footer-delivery">{t('footer.deliveryNote')}</p>
        </div>

        <div className="footer-col">
          <h4>{t('footer.scheduleTitle')}</h4>
          <div className="footer-schedule-cards">
            <div className="footer-schedule-card">
              <span className="schedule-day">{t('hours.monSat')}</span>
              <span className="schedule-time">{t('hours.monSatHours')}</span>
            </div>
            <div className="footer-schedule-card closed">
              <span className="schedule-day">{t('hours.sunHolidays')}</span>
              <span className="schedule-time">{t('hours.closed')}</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.followUs')}</h4>
          <div className="footer-social">
            <a
              href="https://instagram.com/cafetalex_pereira"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
              <span>@cafetalex_pereira</span>
            </a>
            <a
              href="https://facebook.com/cafetalexpereira"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={18} />
              <span>cafetalexpereira</span>
            </a>
            <a
              href="https://www.tripadvisor.ie/Restaurant_Review-g297479-d26552628-Reviews-Cafetalex-Pereira_Risaralda_Department.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star size={18} />
              <span>TripAdvisor</span>
            </a>
            <a
              href="https://www.waze.com/es/live-map/directions/co/risaralda/pereira/cafetalex-tienda-de-cafe-and-restaurante?to=place.ChIJeW2YPE-HOI4R-ao8R5AnOh0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={18} />
              <span>Waze</span>
            </a>
            <a
              href="https://maps.app.goo.gl/Nhjwon2q9AYCrmW47?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={18} />
              <span>Google Maps</span>
            </a>
            <a
              href="https://wa.me/573007823310"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              <span>+57 300 782 3310</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner container">
          <span>{t('footer.rights')}</span>
          <span>
            {t('footer.madeBy')}{' '}
            <a href="https://sebastianardila.com" target="_blank" rel="noopener noreferrer">
              sebastianardila.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
