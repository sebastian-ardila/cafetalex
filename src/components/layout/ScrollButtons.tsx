import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import './ScrollButtons.css'

export default function ScrollButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const scrollRoot = document.getElementById('scroll-root')
    if (!scrollRoot) return
    const onScroll = () => setVisible(scrollRoot.scrollTop > 400)
    scrollRoot.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollRoot.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  const scrollRoot = document.getElementById('scroll-root')

  return (
    <div className="scroll-buttons">
      <button
        className="scroll-btn"
        onClick={() => scrollRoot?.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>
      <button
        className="scroll-btn"
        onClick={() => scrollRoot?.scrollTo({ top: scrollRoot.scrollHeight, behavior: 'smooth' })}
        aria-label="Scroll to bottom"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  )
}
