import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setSkipScrollTop } from '../components/layout/ScrollToTop'
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
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [tried, setTried] = useState(false)

  const nameInvalid = tried && !name.trim()
  const emailInvalid = tried && !email.trim()
  const interestInvalid = tried && !interest
  const messageInvalid = tried && !message.trim()
  const hasErrors = !name.trim() || !email.trim() || !interest || !message.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (hasErrors) return

    const interestLabel = t(`contact.${interest}`)
    const msg = `Hola Cafetalex! Me contacto desde su sitio web

Nombre: ${name}
Email: ${email}
Telefono: ${phone || 'No especificado'}
Interes: ${interestLabel}

Mensaje: ${message}`

    openWhatsApp(msg)
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>

        <form className="form-card card" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('contact.name')}</label>
            <input
              type="text"
              className={`form-control${nameInvalid ? ' field-error' : ''}`}
              placeholder={t('contact.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameInvalid && <span className="error-msg">{t('contact.nameRequired')}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('contact.email')}</label>
              <input
                type="email"
                className={`form-control${emailInvalid ? ' field-error' : ''}`}
                placeholder={t('contact.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailInvalid && <span className="error-msg">{t('contact.emailRequired')}</span>}
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
            <label className={interestInvalid ? 'label-error' : ''}>{t('contact.interestType')}</label>
            <div className={`radio-group${interestInvalid ? ' group-error' : ''}`}>
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
            {interestInvalid && <span className="error-msg">{t('contact.interestRequired')}</span>}
          </div>

          <div className="form-group">
            <label>{t('contact.message')}</label>
            <textarea
              className={`form-control${messageInvalid ? ' field-error' : ''}`}
              rows={4}
              placeholder={t('contact.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {messageInvalid && <span className="error-msg">{t('contact.messageRequired')}</span>}
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-block${hasErrors ? ' btn-disabled-look' : ''}`}
          >
            <MessageCircle size={18} />
            {t('contact.submit')}
          </button>
          {tried && hasErrors && (
            <p className="form-error-summary">{t('contact.requiredFields')}</p>
          )}
        </form>

        <div className="card cta-card">
          <h3>{t('history.ctaTitle')}</h3>
          <p>{t('history.ctaText')}</p>
          <div className="cta-card-buttons">
            <button
              onClick={() => {
                setSkipScrollTop()
                navigate('/')
                setTimeout(() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
              }}
              className="btn btn-primary"
            >
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
