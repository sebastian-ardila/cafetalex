import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import CartFab from '../cart/CartFab'
import ScrollButtons from './ScrollButtons'

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div id="scroll-root" className="scroll-container">
        <Breadcrumb />
        <Outlet />
        <Footer />
      </div>
      <CartDrawer />
      <CartFab />
      <ScrollButtons />
    </div>
  )
}
