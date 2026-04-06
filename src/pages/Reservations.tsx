import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { setSkipScrollTop } from '../components/layout/ScrollToTop'
import {
  Clock,
  MapPin,
  UtensilsCrossed,
  Mail,
  CalendarDays,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useTranslation } from '../i18n/useTranslation'
import { openWhatsApp } from '../utils/whatsapp'
import {
  getTimeSlots,
  groupSlots,
  formatTime,
  formatDateLabel,
  getTodayStr,
} from '../data/schedule'
import './Pages.css'

const groupIcons = { morning: Sun, afternoon: Sunset, evening: Moon } as const

export default function Reservations() {
  const { t, lang } = useTranslation()
  const navigate = useNavigate()
  const dateRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [people, setPeople] = useState(2)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [comments, setComments] = useState('')
  const [tried, setTried] = useState(false)

  const dayOfWeek = date ? new Date(date + 'T12:00:00').getDay() : -1
  const slots = useMemo(() => (dayOfWeek >= 0 ? getTimeSlots(dayOfWeek) : []), [dayOfWeek])
  const groups = useMemo(() => groupSlots(slots), [slots])
  const isClosed = date !== '' && slots.length === 0

  const handleDateChange = (val: string) => {
    if (val < getTodayStr()) return
    setDate(val)
    const newDay = new Date(val + 'T12:00:00').getDay()
    const newSlots = getTimeSlots(newDay)
    if (time && !newSlots.includes(time)) setTime('')
  }

  const openDatePicker = () => {
    const input = dateRef.current
    if (!input) return
    try { input.showPicker() } catch { input.click() }
  }

  const nameInvalid = tried && !name.trim()
  const dateInvalid = tried && !date
  const timeInvalid = tried && !time
  const hasErrors = !name.trim() || !date || isClosed || !time

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (hasErrors) return

    const dateLabel = formatDateLabel(date, lang)
    const timeLabel = formatTime(time)
    const message = `Hola Cafetalex! Quiero reservar una mesa

Nombre: ${name}
Personas: ${people}
Fecha: ${dateLabel}
Hora: ${timeLabel}${comments ? `\nComentarios: ${comments}` : ''}`

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

        <form className="form-card card" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('reservations.name')}</label>
            <input
              type="text"
              className={`form-control${nameInvalid ? ' field-error' : ''}`}
              placeholder={t('reservations.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameInvalid && <span className="error-msg">{t('reservations.nameRequired')}</span>}
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
              <div className={`date-btn${dateInvalid ? ' field-error' : ''}${isClosed ? ' field-warning' : ''}`}>
                <CalendarDays size={16} />
                <span>{date ? formatDateLabel(date, lang) : t('reservations.selectDate')}</span>
                <input
                  ref={dateRef}
                  type="date"
                  className="date-input-overlay"
                  value={date}
                  min={getTodayStr()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  onClick={() => { try { dateRef.current?.showPicker() } catch {} }}
                />
              </div>
              {dateInvalid && <span className="error-msg">{t('reservations.dateRequired')}</span>}
              {isClosed && <span className="warning-msg">{t('reservations.closedDay')}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>{t('reservations.time')}</label>
            {!date ? (
              <button
                type="button"
                className="date-btn date-btn--disabled"
                onClick={openDatePicker}
              >
                <Clock size={16} />
                <span>{t('reservations.selectTime')}</span>
              </button>
            ) : isClosed ? null : (
              <div className="time-slots">
                {groups.map((g) => {
                  const Icon = groupIcons[g.key]
                  return (
                    <div key={g.key} className="slot-group">
                      <span className="slot-group-label">
                        <Icon size={14} />
                        {t(`reservations.${g.key}`)}
                      </span>
                      <div className="slot-chips">
                        {g.slots.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`slot-chip${time === s ? ' active' : ''}`}
                            onClick={() => setTime(s)}
                          >
                            {formatTime(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {timeInvalid && !isClosed && <span className="error-msg">{t('reservations.timeRequired')}</span>}
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

          <button
            type="submit"
            className={`btn btn-primary btn-block${hasErrors ? ' btn-disabled-look' : ''}`}
          >
            <FaWhatsapp size={18} />
            {t('reservations.submit')}
          </button>
          {tried && hasErrors && (
            <p className="form-error-summary">{t('reservations.requiredFields')}</p>
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
                setTimeout(() => (() => { const el = document.getElementById('menu-section'); const sr = document.getElementById('scroll-root'); if (el && sr) { const y = el.getBoundingClientRect().top - sr.getBoundingClientRect().top + sr.scrollTop; sr.scrollTo({ top: y, behavior: 'smooth' }) } })(), 100)
              }}
              className="btn btn-primary"
            >
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
