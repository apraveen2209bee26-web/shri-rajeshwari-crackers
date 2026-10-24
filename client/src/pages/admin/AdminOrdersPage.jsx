import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '../../api';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { formatCurrency, formatDate, formatLabel, formatPaymentMethod, statusBadgeClass } from '../../lib/utils';

const getInitialDraft = (order) => ({
  status: order.status,
  courierName: order.tracking?.courierName || '',
  trackingId: order.tracking?.trackingId || '',
  estimatedDelivery: order.tracking?.estimatedDelivery?.slice(0, 10) || '',
  note: '',
});

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data.orders);
      setDrafts(
        data.orders.reduce((accumulator, order) => {
          accumulator[order._id] = getInitialDraft(order);
          return accumulator;
        }, {}),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleFieldChange = (orderId, name, value) => {
    setDrafts((current) => ({
      ...current,
      [orderId]: {
        ...current[orderId],
        [name]: value,
      },
    }));
  };

  const handleSave = async (orderId) => {
    setSavingOrderId(orderId);
    try {
      await api.updateOrderStatus(orderId, drafts[orderId]);
      toast.success('Order updated successfully');
      await loadOrders();
    } finally {
      setSavingOrderId(null);
    }
  };

  if (loading) {
    return <Loader label="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Order management</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">Track dispatch and delivery flow</h1>
      </div>

      {orders.map((order) => {
        const draft = drafts[order._id];

        return (
          <article key={order._id} className="glass-card p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">{order.orderNumber}</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-coal-900">{order.user?.name || 'Customer'}</h2>
                <p className="mt-2 text-sm text-coal-600">{order.user?.email}</p>
                <p className="mt-1 text-sm text-coal-600">Placed on {formatDate(order.createdAt)}</p>
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

            <div className="mt-6 grid gap-4 rounded-[24px] bg-amber-50 p-5 sm:grid-cols-2 xl:grid-cols-5">
              <label>
                <span className="label">Status</span>
                <select
                  className="input"
                  onChange={(event) => handleFieldChange(order._id, 'status', event.target.value)}
                  value={draft?.status || order.status}
                >
                  <option value="created">Created</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>
                <span className="label">Courier name</span>
                <input
                  className="input"
                  onChange={(event) => handleFieldChange(order._id, 'courierName', event.target.value)}
                  value={draft?.courierName || ''}
                />
              </label>
              <label>
                <span className="label">Tracking ID</span>
                <input
                  className="input"
                  onChange={(event) => handleFieldChange(order._id, 'trackingId', event.target.value)}
                  value={draft?.trackingId || ''}
                />
              </label>
              <label>
                <span className="label">Estimated delivery</span>
                <input
                  className="input"
                  onChange={(event) => handleFieldChange(order._id, 'estimatedDelivery', event.target.value)}
                  type="date"
                  value={draft?.estimatedDelivery || ''}
                />
              </label>
              <label>
                <span className="label">Admin note</span>
                <input
                  className="input"
                  onChange={(event) => handleFieldChange(order._id, 'note', event.target.value)}
                  value={draft?.note || ''}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <span key={item.product} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-coal-700 shadow-sm">
                    {item.name} x {item.quantity}
                  </span>
                ))}
              </div>
              <Button disabled={savingOrderId === order._id} onClick={() => handleSave(order._id)} variant="accent">
                {savingOrderId === order._id ? 'Saving...' : 'Save update'}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AdminOrdersPage;
