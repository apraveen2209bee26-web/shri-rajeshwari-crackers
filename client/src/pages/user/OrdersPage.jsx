import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../../api';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import { formatCurrency, formatDate, formatLabel, formatPaymentMethod, statusBadgeClass } from '../../lib/utils';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await api.getMyOrders();
        setOrders(data.orders);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <Loader label="Loading your orders..." />;
  }

  if (!orders.length) {
    return (
      <div className="shell py-14">
        <EmptyState
          action={
            <Button as={Link} to="/shop" variant="accent">
              Shop now
            </Button>
          }
          description="Once you complete a purchase, your order history and tracking updates will appear here."
          title="No orders yet"
        />
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember-700">My orders</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-coal-900">Track your purchases</h1>
        </div>
        <Button as={Link} to="/account/profile" variant="soft">
          Update profile
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="glass-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">{order.orderNumber}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-coal-900">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </h2>
                <p className="mt-2 text-sm text-coal-600">Ordered on {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
                <p className="mt-3 text-sm font-semibold text-coal-600">
                  {formatPaymentMethod(order.payment?.provider)} - {formatLabel(order.payment?.status)}
                </p>
                <p className="mt-3 text-xl font-extrabold text-coal-900">{formatCurrency(order.pricing.total)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {order.items.slice(0, 3).map((item) => (
                <span key={item.product} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-coal-700">
                  {item.name}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <Button as={Link} to={`/account/orders/${order._id}`} variant="accent">
                View order details
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
