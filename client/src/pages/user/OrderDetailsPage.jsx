import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { api } from '../../api';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { formatCurrency, formatDate, formatLabel, formatPaymentMethod, statusBadgeClass } from '../../lib/utils';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await api.getOrderById(orderId);
        setOrder(data.order);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return <Loader label="Loading order details..." />;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="glass-card p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">{order.orderNumber}</p>
                <h1 className="mt-3 font-display text-4xl font-extrabold text-coal-900">Order details</h1>
                <p className="mt-3 text-sm text-coal-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center gap-4 rounded-[24px] bg-amber-50 p-4">
                  <img alt={item.name} className="h-20 w-20 rounded-2xl object-cover" src={item.imageUrl} />
                  <div className="flex-1">
                    <p className="font-bold text-coal-900">{item.name}</p>
                    <p className="text-sm text-coal-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-coal-900">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Tracking timeline</p>
            <div className="mt-6 space-y-5">
              {order.statusHistory?.map((entry) => (
                <div key={`${entry.status}-${entry.at}`} className="relative pl-8">
                  <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-ember-500" />
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-coal-500">{entry.status}</p>
                  <p className="mt-1 text-base font-semibold text-coal-900">{entry.label}</p>
                  <p className="mt-1 text-sm text-coal-700">{entry.note}</p>
                  <p className="mt-2 text-xs text-coal-500">{formatDate(entry.at)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Delivery address</p>
            <div className="mt-4 text-sm leading-7 text-coal-700">
              <p className="font-bold text-coal-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Payment summary</p>
            <div className="mt-6 space-y-4 text-sm text-coal-700">
              <div className="flex justify-between">
                <span>Payment method</span>
                <span>{formatPaymentMethod(order.payment?.provider)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment status</span>
                <span>{formatLabel(order.payment?.status)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(order.pricing.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.pricing.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-ember-200 pt-4 text-lg font-bold text-coal-900">
                <span>Total</span>
                <span>{formatCurrency(order.pricing.total)}</span>
              </div>
            </div>
          </div>

          <Button as={Link} to="/account/orders" variant="soft">
            Back to all orders
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
