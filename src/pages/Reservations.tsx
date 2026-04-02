import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, MessageCircle, UtensilsCrossed, Mail } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import { openWhatsApp } from '../utils/whatsapp'
import './Pages.css'

export default function Reservations() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [people, setPeople] = useState(2)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const navigate = useNavigate()
  const [comments, setComments] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = `👋 Hola Cafetalex! Quiero reservar una mesa

👤 Nombre: ${name}
👥 Personas: ${people}
📅 Fecha: ${date}
🕐 Hora: ${time}${comments ? `\n💬 Comentarios: ${comments}` : ''}`

    openWhatsApp(message)
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>{t('reservations.title')}</h1>
          <p>{t('reservations.subtitle')}</p>
        </div>

        <div className="info-cards">
          <div className="card info-card">
            <Clock size={20} className="info-icon" />
            <h3>{t('reservations.scheduleTitle')}</h3>
            <p>{t('hours.monSat')}: {t('hours.monSatHours')}</p>
            <p className="text-muted">{t('hours.sunHolidays')}: {t('hours.closed')}</p>
          </div>
          <div className="card info-card">
            <MapPin size={20} className="info-icon" />
            <h3>{t('reservations.locationTitle')}</h3>
            <p>{t('hours.address')}</p>
          </div>
        </div>

        <form className="form-card card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('reservations.name')}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t('reservations.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('reservations.people')}</label>
              <input
                type="number"
                className="form-control"
                min={1}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>{t('reservations.date')}</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('reservations.time')}</label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('reservations.comments')}</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder={t('reservations.commentsPlaceholder')}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            <MessageCircle size={18} />
            {t('reservations.submit')}
          </button>
        </form>

        <div className="card cta-card">
          <h3>{t('history.ctaTitle')}</h3>
          <p>{t('history.ctaText')}</p>
          <div className="cta-card-buttons">
            <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className="btn btn-primary">
              <UtensilsCrossed size={18} />
              {t('history.ctaButton')}
            </button>
            <button onClick={() => navigate('/contact')} className="btn btn-outline">
              <Mail size={18} />
              {t('nav.contact')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
