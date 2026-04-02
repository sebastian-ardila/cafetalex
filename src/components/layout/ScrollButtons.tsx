import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import './ScrollButtons.css'

export default function ScrollButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="scroll-buttons">
      <button
        className="scroll-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>
      <button
        className="scroll-btn"
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        aria-label="Scroll to bottom"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  )
}
