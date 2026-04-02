import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import ScrollButtons from './ScrollButtons'

export default function Layout() {
  return (
    <>
      <Navbar />
      <Breadcrumb />
      <Outlet />
      <Footer />
      <CartDrawer />
      <ScrollButtons />
    </>
  )
}
