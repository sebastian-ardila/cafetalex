import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <Breadcrumb />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  )
}
