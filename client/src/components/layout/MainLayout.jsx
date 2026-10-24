import { Outlet } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

import { STORE_INFO } from '../../lib/config'
import Footer from './Footer'
import Navbar from './Navbar'

const MainLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <a
      aria-label={`Contact ${STORE_INFO.name} on WhatsApp`}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.38)] transition hover:-translate-y-1 hover:bg-[#20bd5a]"
      href={STORE_INFO.whatsappUrl}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  </div>
)

export default MainLayout
