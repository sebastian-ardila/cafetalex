import { useState, useEffect, useRef } from 'react'
import { X, ArrowLeft, Camera, CheckCircle } from 'lucide-react'
import { MdTableRestaurant } from 'react-icons/md'
import { useTable } from '../../context/TableContext'
import { useLangStore } from '../../i18n/useTranslation'
import './TableModal.css'

const isMobile = /Android|iPhone|iPad|iPod|HarmonyOS|Huawei|HUAWEI/i.test(navigator.userAgent)

interface Props {
  open: boolean
  onClose: () => void
}

export default function TableModal({ open, onClose }: Props) {
  const { tableNumber, setTableNumber, hasTable } = useTable()
  const lang = useLangStore((s) => s.lang)
  const [mode, setMode] = useState<'menu' | 'qr' | 'confirmed'>('menu')
  const [confirmedTable, setConfirmedTable] = useState('')

  useEffect(() => {
    if (open) setMode('menu')
  }, [open])

  if (!open) return null

  const selectTable = (n: string) => {
    setTableNumber(n)
    onClose()
  }

  const handleQrSuccess = (n: string) => {
    setTableNumber(n)
    setConfirmedTable(n)
    setMode('confirmed')
  }

  const removeTable = () => {
    setTableNumber('')
    onClose()
  }

  if (mode === 'confirmed') {
    return <ConfirmationOverlay table={confirmedTable} onClose={onClose} lang={lang} />
  }

  return (
    <div className="table-modal-overlay" onClick={onClose}>
      <div className="table-modal" onClick={(e) => e.stopPropagation()}>
        {mode === 'menu' ? (
          <>
            <div className="table-modal-header">
              <MdTableRestaurant size={22} />
              <h3>{lang === 'en' ? 'Select your table' : 'Selecciona tu mesa'}</h3>
              <button className="table-modal-close" onClick={onClose}><X size={20} /></button>
            </div>

            {hasTable && (
              <p className="table-modal-current">
                {lang === 'en' ? 'Currently at Table' : 'Actualmente en Mesa'}{' '}
                <strong>{tableNumber}</strong>
              </p>
            )}

            <div className="table-grid">
              {Array.from({ length: 20 }, (_, i) => String(i + 1)).map((n) => (
                <button
                  key={n}
                  className={`table-grid-btn${tableNumber === n ? ' active' : ''}`}
                  onClick={() => selectTable(n)}
                >
                  {n}
                </button>
              ))}
            </div>

            {isMobile && (
              <button className="table-qr-btn" onClick={() => setMode('qr')}>
                <Camera size={18} />
                {lang === 'en' ? 'Scan QR code' : 'Escanear código QR'}
              </button>
            )}

            {hasTable && (
              <button className="table-remove-btn" onClick={removeTable}>
                {lang === 'en' ? 'Remove table' : 'Quitar mesa'}
              </button>
            )}
          </>
        ) : (
          <>
            <div className="table-modal-header">
              <button className="table-modal-back" onClick={() => setMode('menu')}>
                <ArrowLeft size={18} />
              </button>
              <h3>{lang === 'en' ? 'Scan QR' : 'Escanear QR'}</h3>
              <button className="table-modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <QrScanner onSuccess={handleQrSuccess} lang={lang} />
          </>
        )}
      </div>
    </div>
  )
}

function QrScanner({ onSuccess, lang }: { onSuccess: (n: string) => void; lang: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      const { Html5Qrcode } = await import('html5-qrcode')
      if (cancelled || !containerRef.current) return

      const scanner = new Html5Qrcode(containerRef.current.id)
      scannerRef.current = scanner

      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 200, height: 200 } },
          (text) => {
            // Try to extract mesa from URL or plain number
            let mesa = ''
            try {
              const url = new URL(text)
              const hash = url.hash
              const qIndex = hash.indexOf('?')
              if (qIndex >= 0) {
                const params = new URLSearchParams(hash.slice(qIndex))
                mesa = params.get('mesa') || ''
              }
            } catch {
              // Not a URL, try plain number
              if (/^[1-9]\d?$/.test(text.trim())) {
                mesa = text.trim()
              }
            }

            const n = parseInt(mesa, 10)
            if (n >= 1 && n <= 20) {
              scanner.stop().catch(() => {})
              onSuccess(String(n))
            }
          },
          () => {}
        )
      } catch {
        if (!cancelled) {
          setError(lang === 'en' ? 'Could not access camera' : 'No se pudo acceder a la cámara')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      scannerRef.current?.stop().catch(() => {})
    }
  }, [onSuccess, lang])

  return (
    <div className="qr-scanner-wrapper">
      <div id="qr-reader" ref={containerRef} className="qr-reader" />
      {error && <p className="qr-error">{error}</p>}
    </div>
  )
}

function ConfirmationOverlay({ table, onClose, lang }: { table: string; onClose: () => void; lang: string }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="table-confirmed-overlay animate-fade-in" onClick={onClose}>
      <div className="table-confirmed-content">
        <CheckCircle size={72} className="table-confirmed-icon" />
        <p className="table-confirmed-label">
          {lang === 'en' ? 'TABLE ASSIGNED' : 'MESA ASIGNADA'}
        </p>
        <p className="table-confirmed-number">{table}</p>
      </div>
    </div>
  )
}
