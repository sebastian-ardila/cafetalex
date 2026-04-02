import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle,
  Building2,
  Package,
  Handshake,
  PartyPopper,
  Cake,
  HelpCircle,
  UtensilsCrossed,
  CalendarCheck,
} from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import { openWhatsApp } from '../utils/whatsapp'
import './Pages.css'

const interestOptions = [
  { key: 'franchise', icon: Building2 },
  { key: 'supplier', icon: Package },
  { key: 'collaboration', icon: Handshake },
  { key: 'events', icon: PartyPopper },
  { key: 'birthday', icon: Cake },
  { key: 'other', icon: HelpCircle },
] as const

export default function Contact() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('other')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const interestLabel = t(`contact.${interest}`)
    const msg = `👋 Hola Cafetalex! Me contacto desde su sitio web

👤 Nombre: ${name}
📧 Email: ${email}
📱 Telefono: ${phone}
💼 Interes: ${interestLabel}

💬 Mensaje: ${message}`

    openWhatsApp(msg)
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>

        <form className="form-card card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('contact.name')}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t('contact.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('contact.email')}</label>
              <input
                type="email"
                className="form-control"
                placeholder={t('contact.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('contact.phone')}</label>
              <input
                type="tel"
                className="form-control"
                placeholder={t('contact.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('contact.interestType')}</label>
            <div className="radio-group">
              {interestOptions.map((opt) => (
                <div className="radio-option" key={opt.key}>
                  <input
                    type="radio"
                    id={`interest-${opt.key}`}
                    name="interest"
                    checked={interest === opt.key}
                    onChange={() => setInterest(opt.key)}
                  />
                  <label htmlFor={`interest-${opt.key}`}>
                    <opt.icon size={16} />
                    {t(`contact.${opt.key}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t('contact.message')}</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder={t('contact.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            <MessageCircle size={18} />
            {t('contact.submit')}
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
