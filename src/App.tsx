import { HashRouter, Routes, Route } from 'react-router-dom'
import { TableProvider } from './context/TableContext'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Reservations from './pages/Reservations'
import HoursLocation from './pages/HoursLocation'
import History from './pages/History'
import Contact from './pages/Contact'

export default function App() {
  return (
    <HashRouter>
      <TableProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/hours" element={<HoursLocation />} />
            <Route path="/history" element={<History />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </TableProvider>
    </HashRouter>
  )
}
