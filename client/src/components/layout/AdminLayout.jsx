import { LayoutDashboard, Package, ScrollText } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Button from '../ui/Button';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ScrollText },
];

const AdminLayout = () => (
  <div className="min-h-screen bg-festive-paper">
    <Navbar />
    <div className="shell grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="glass-card h-fit p-6">
        <p className="festive-chip">Control room</p>
        <p className="mt-4 font-display text-3xl font-bold text-coal-900">Admin Console</p>
        <p className="mt-2 text-sm leading-7 text-coal-600">Manage stock, orders, and storefront activity with the same festive theme as the customer-facing client.</p>
        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-ember-600 text-white shadow-lg' : 'hover:bg-amber-50 hover:text-ember-700'
                  }`
                }
                end={link.to === '/admin'}
                to={link.to}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-8 rounded-[28px] bg-gradient-to-br from-ember-700 to-ember-600 p-5 text-white shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">Quick Note</p>
          <p className="mt-3 text-sm leading-6 text-white/90">
            Product creation supports direct image upload to Cloudinary via the server.
          </p>
          <Button as={NavLink} className="mt-5 w-full" to="/" variant="soft">
            Back to Store
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
