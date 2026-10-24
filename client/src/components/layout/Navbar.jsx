import { Mail, MapPin, Phone, Search, ShoppingBag, Sparkles, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { STORE_INFO } from '../../lib/config';
import Button from '../ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const profileLink = user?.role === 'user' ? '/account/profile' : '/admin';

  const handleLogout = () => {
    logout();
    navigate(user?.role === 'admin' ? '/admin/login' : '/');
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2.5 text-sm font-semibold transition ${
      isActive ? 'bg-[#ff0019] text-white shadow-md' : 'text-coal-700 hover:bg-ember-50 hover:text-[#ff0019]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ember-100 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="bg-[#ff0019] text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-2 text-xs font-semibold">
          <div className="hidden flex-wrap items-center gap-4 lg:flex">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {STORE_INFO.location}
            </span>
            <a className="inline-flex items-center gap-1.5 transition hover:text-amber-100" href={`tel:${STORE_INFO.phoneRaw}`}>
              <Phone className="h-3.5 w-3.5" />
              {STORE_INFO.phone}
            </a>
            <a className="inline-flex items-center gap-1.5 transition hover:text-amber-100" href={`mailto:${STORE_INFO.email}`}>
              <Mail className="h-3.5 w-3.5" />
              {STORE_INFO.email}
            </a>
          </div>
          <div className="min-w-0 flex-1 overflow-hidden text-center">
            <p className="topbar-marquee whitespace-nowrap text-sm font-bold">
              {STORE_INFO.tamilGreeting}
            </p>
          </div>
          <NavLink className="rounded-full border border-white/25 px-3 py-1 text-white transition hover:bg-white/10" to="/admin/login">
            Admin access
          </NavLink>
        </div>
      </div>

      <div className="shell py-4">
        <div className="flex items-center justify-between gap-4">
          <NavLink className="flex items-center gap-3" to="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff0019] text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-[#ff0019] [text-shadow:2px_2px_5px_rgba(128,128,128,0.55)]">
                {STORE_INFO.name}
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-coal-600">Quality crackers</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 rounded-full border border-amber-200 bg-white p-2 shadow-sm lg:flex">
            <NavLink className={navLinkClass} to="/">
              Home
            </NavLink>
            <NavLink className={navLinkClass} to="/shop">
              Shop
            </NavLink>
            <NavLink className={navLinkClass} to="/cart">
              Cart
            </NavLink>
            {user?.role === 'user' ? (
              <NavLink className={navLinkClass} to="/account/orders">
                My Orders
              </NavLink>
            ) : null}
            {user?.role === 'admin' ? (
              <NavLink className={navLinkClass} to="/admin">
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <NavLink className="hidden rounded-full border border-amber-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 sm:inline-flex" to="/shop">
              <Search className="h-5 w-5 text-[#ff0019]" />
            </NavLink>

            <NavLink className="relative rounded-full border border-amber-200 bg-amber-50 p-3 shadow-sm transition hover:-translate-y-0.5" to="/cart">
              <ShoppingBag className="h-5 w-5 text-[#ff0019]" />
              {cart.itemCount ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff0019] px-1 text-[10px] font-bold text-white">
                  {cart.itemCount}
                </span>
              ) : null}
            </NavLink>

            {isAuthenticated ? (
              <div className="hidden items-center gap-3 rounded-full border border-amber-200 bg-white px-4 py-2 shadow-sm md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-ember-700">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-coal-900">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-coal-600">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                </div>
                <Button as={NavLink} className="px-4 py-2 text-xs" to={profileLink} variant="soft">
                  {user?.role === 'admin' ? 'Dashboard' : 'View Profile'}
                </Button>
                <Button className="px-4 py-2 text-xs" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button as={NavLink} to="/login" variant="ghost">
                  User Login
                </Button>
                <Button as={NavLink} to="/admin/login" variant="accent">
                  Admin Login
                </Button>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-4 flex flex-wrap items-center gap-2 lg:hidden">
          <NavLink className={navLinkClass} to="/">
            Home
          </NavLink>
          <NavLink className={navLinkClass} to="/shop">
            Shop
          </NavLink>
          {user?.role === 'user' ? (
            <NavLink className={navLinkClass} to="/account/orders">
              Orders
            </NavLink>
          ) : null}
          {user?.role === 'user' ? (
              <NavLink className={navLinkClass} to="/account/profile">
              Profile
            </NavLink>
          ) : null}
          <NavLink className={navLinkClass} to="/cart">
            Cart
          </NavLink>
          {user?.role === 'admin' ? (
            <NavLink className={navLinkClass} to="/admin">
              Admin
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <button className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-coal-700 shadow-sm transition hover:bg-amber-50" onClick={handleLogout} type="button">
              Logout
            </button>
          ) : null}
          {!isAuthenticated ? (
            <>
              <NavLink className={navLinkClass} to="/login">
                Login
              </NavLink>
              <NavLink className={navLinkClass} to="/admin/login">
                Admin Login
              </NavLink>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
