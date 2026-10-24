import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../../api';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { formatCurrency, formatDate, statusBadgeClass } from '../../lib/utils';

const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await api.getAdminOverview();
        setOverview(data.overview);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  if (loading) {
    return <Loader label="Loading admin overview..." />;
  }

  if (!overview) {
    return null;
  }

  const statCards = [
    ['Customers', overview.totalUsers],
    ['Products', overview.totalProducts],
    ['Low stock', overview.lowStockCount],
    ['Revenue', formatCurrency(overview.totalRevenue)],
  ];

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Overview</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">Store performance snapshot</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(([label, value]) => (
            <div key={label} className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coal-500">{label}</p>
              <p className="mt-3 font-display text-3xl font-bold text-coal-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <section className="glass-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Recent orders</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-coal-900">Latest customer activity</h2>
            </div>
            <Button as={Link} to="/admin/orders" variant="soft">
              View all orders
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {overview.recentOrders.map((order) => (
              <div key={order._id} className="rounded-[24px] bg-amber-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">{order.orderNumber}</p>
                    <p className="mt-2 text-lg font-bold text-coal-900">{order.user?.name || 'Customer'}</p>
                    <p className="text-sm text-coal-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="mt-3 text-lg font-extrabold text-coal-900">{formatCurrency(order.pricing.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="glass-card p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Quick actions</p>
          <div className="mt-6 space-y-4">
            <Button as={Link} className="w-full" to="/admin/products" variant="accent">
              Manage products
            </Button>
            <Button as={Link} className="w-full" to="/admin/orders" variant="soft">
              Update order status
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

