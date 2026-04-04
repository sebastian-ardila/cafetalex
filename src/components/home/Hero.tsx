import { Link } from 'react-router-dom'
import { Star, ExternalLink } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import './Hero.css'

export default function Hero() {
  const { t } = useTranslation()

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section')
    const scrollRoot = document.getElementById('scroll-root')
    if (el && scrollRoot) {
      const y = el.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + scrollRoot.scrollTop
      scrollRoot.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={import.meta.env.BASE_URL + 'video-hero.webm'} type="video/webm" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content">
        <img
          src={import.meta.env.BASE_URL + 'cafetalex-logo.webp'}
          alt="Cafetalex"
          className="hero-logo"
        />
        <p className="hero-subtitle">{t('hero.title')}</p>

        <div className="hero-reviews">
          <a
            href="https://www.tripadvisor.ie/Restaurant_Review-g297479-d26552628-Reviews-Cafetalex-Pereira_Risaralda_Department.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-review-btn"
          >
            <Star size={14} />
            {t('hero.reviewTripadvisor')}
            <ExternalLink size={12} />
          </a>
          <a
            href="https://share.google/LaYNi5jAOsmNrYAlY"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-review-btn"
          >
            <Star size={14} />
            {t('hero.reviewGoogle')}
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="hero-actions">
          <button onClick={scrollToMenu} className="btn btn-primary">
            {t('hero.viewMenu')}
          </button>
          <Link to="/reservations" className="btn btn-outline">
            {t('hero.reserveTable')}
          </Link>
        </div>
      </div>
    </section>
  )
}
