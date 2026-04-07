import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface TableContextType {
  tableNumber: string
  setTableNumber: (n: string) => void
  hasTable: boolean
}

const TableContext = createContext<TableContextType>({
  tableNumber: '',
  setTableNumber: () => {},
  hasTable: false,
})

export function useTable() {
  return useContext(TableContext)
}

function getHashParams(): URLSearchParams {
  const hash = window.location.hash
  const qIndex = hash.indexOf('?')
  return new URLSearchParams(qIndex >= 0 ? hash.slice(qIndex) : '')
}

function updateHashParam(key: string, value: string | null) {
  const hash = window.location.hash
  const qIndex = hash.indexOf('?')
  const path = qIndex >= 0 ? hash.slice(0, qIndex) : hash
  const params = new URLSearchParams(qIndex >= 0 ? hash.slice(qIndex) : '')

  if (value) {
    params.set(key, value)
  } else {
    params.delete(key)
  }

  const qs = params.toString()
  const newHash = qs ? `${path}?${qs}` : path
  window.history.replaceState(null, '', newHash)
}

function readMesaFromURL(): string {
  const val = getHashParams().get('mesa')
  if (val && /^[1-9]\d?$/.test(val)) {
    const n = parseInt(val, 10)
    if (n >= 1 && n <= 20) return val
  }
  return ''
}

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableNumber, setTableNumberState] = useState(() => readMesaFromURL())

  const setTableNumber = useCallback((n: string) => {
    setTableNumberState(n)
    updateHashParam('mesa', n || null)
  }, [])

  // Listen for URL changes
  useEffect(() => {
    const sync = () => {
      const urlMesa = readMesaFromURL()
      setTableNumberState((prev) => (urlMesa !== prev ? urlMesa : prev))
    }

    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    const interval = setInterval(sync, 1000)

    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
      clearInterval(interval)
    }
  }, [])

  return (
    <TableContext.Provider value={{ tableNumber, setTableNumber, hasTable: !!tableNumber }}>
      {children}
    </TableContext.Provider>
  )
}
