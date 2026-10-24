import { Link } from 'react-router-dom'
import { CreditCard, ShieldCheck, Wallet } from 'lucide-react'
import { STORE_INFO } from '../../lib/config'

const Footer = () => (
  <footer className="mt-20 bg-coal-900 text-white">
    <div className="border-b border-gold-300/20">
      <div className="shell grid gap-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
            {STORE_INFO.name}
          </p>
          <h3 className="mt-4 font-display text-4xl font-extrabold text-amber-100">Quality Crackers & Affordable Price</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
            Diwali Mega Sale with direct order support from {STORE_INFO.location}. Up to 70% OFF on selected crackers and festive packs.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">Payment support</p>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Payment accepted for online and direct customer orders.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/90">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Credit card payments</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/90">
              <Wallet className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Wallet payments</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/90">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="shell grid gap-8 py-10 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr_0.9fr_1.2fr]">
      <div>
        <h4 className="font-display text-2xl font-bold text-white">{STORE_INFO.name}</h4>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
          Your festive cracker shop at {STORE_INFO.location}, offering quality crackers, gift boxes, and seasonal deals for Diwali celebrations.
        </p>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">Shop Info</p>
        <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
          <Link className="transition hover:text-white" to="/">Home</Link>
          <Link className="transition hover:text-white" to="/shop">Shop</Link>
          <a className="transition hover:text-white" href="/#contact">Contact Us</a>
          <Link className="transition hover:text-white" to="/shop">Privacy Policy</Link>
          <Link className="transition hover:text-white" to="/shop">Terms & Condition</Link>
          <Link className="transition hover:text-white" to="/shop">FAQs & Help</Link>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">Account</p>
        <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
          <Link className="transition hover:text-white" to="/cart">Shopping Cart</Link>
          <Link className="transition hover:text-white" to="/login">User Login</Link>
          <Link className="transition hover:text-white" to="/register">Register</Link>
          <Link className="transition hover:text-white" to="/account/profile">Profile</Link>
          <Link className="transition hover:text-white" to="/account/orders">Order History</Link>
          <Link className="transition hover:text-white" to="/checkout">Checkout</Link>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">Contact</p>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-7 text-white/75">
          <p>Address: {STORE_INFO.address}</p>
          <a className="transition hover:text-white" href={`mailto:${STORE_INFO.email}`}>Email: {STORE_INFO.email}</a>
          <a className="transition hover:text-white" href={`tel:${STORE_INFO.phoneRaw}`}>Phone: {STORE_INFO.phone}</a>
          <a className="transition hover:text-white" href={STORE_INFO.whatsappUrl} rel="noreferrer" target="_blank">WhatsApp: {STORE_INFO.phone}</a>
          <p>Payment Accepted</p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
