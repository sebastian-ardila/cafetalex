import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Global flag: set to true when navigating to home to view the menu
// (skip scroll-to-top so the menu scroll can happen instead)
let skipNextScrollTop = false

export function setSkipScrollTop() {
  skipNextScrollTop = true
}

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname

    if (skipNextScrollTop) {
      skipNextScrollTop = false
      return
    }

    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
