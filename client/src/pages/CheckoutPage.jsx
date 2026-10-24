import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency, loadScript } from '../lib/utils';

const createAddressFromUser = (user) => ({
  fullName: user?.defaultAddress?.fullName || user?.name || '',
  phone: user?.defaultAddress?.phone || user?.phone || '',
  line1: user?.defaultAddress?.line1 || '',
  line2: user?.defaultAddress?.line2 || '',
  city: user?.defaultAddress?.city || '',
  state: user?.defaultAddress?.state || '',
  postalCode: user?.defaultAddress?.postalCode || '',
  country: user?.defaultAddress?.country || 'India',
  landmark: user?.defaultAddress?.landmark || '',
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(createAddressFromUser(user));
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setShippingAddress(createAddressFromUser(user));
  }, [user]);

  if (!cart.items.length) {
    return (
      <div className="shell py-14">
        <EmptyState
          action={
            <Button as={Link} to="/shop" variant="accent">
              Continue shopping
            </Button>
          }
          description="Add products to your cart before starting checkout."
          title="Your cart is empty"
        />
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      const data = await api.createCheckout({
        shippingAddress,
        notes,
        paymentMethod,
      });

      if (data.paymentMethod === 'cod' || !data.requiresPayment) {
        await clearCart();
        toast.success('Cash on delivery order placed successfully');
        navigate(`/account/orders/${data.order._id}`);
        setProcessing(false);
        return;
      }

      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      const razorpay = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: data.razorpay.name,
        description: data.razorpay.description,
        order_id: data.razorpay.orderId,
        prefill: data.razorpay.prefill,
        theme: {
          color: '#e12610',
        },
        handler: async (response) => {
          const verification = await api.verifyPayment({
            orderId: data.order._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await clearCart();
          toast.success('Payment successful and order confirmed');
          navigate(`/account/orders/${verification.order._id}`);
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      });

      razorpay.open();
      setProcessing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to start payment');
      setProcessing(false);
    }
  };

  return (
    <div className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="glass-card p-8" onSubmit={handleCheckout}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember-700">Checkout</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">Delivery details</h1>
          <p className="mt-3 text-sm leading-7 text-coal-700">
            Enter your shipping information and choose between secure online payment or cash on delivery.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="label">Full name</span>
              <input className="input" name="fullName" onChange={handleChange} required value={shippingAddress.fullName} />
            </label>
            <label>
              <span className="label">Phone</span>
              <input className="input" name="phone" onChange={handleChange} required value={shippingAddress.phone} />
            </label>
            <label>
              <span className="label">Postal code</span>
              <input className="input" name="postalCode" onChange={handleChange} required value={shippingAddress.postalCode} />
            </label>
            <label className="sm:col-span-2">
              <span className="label">Address line 1</span>
              <input className="input" name="line1" onChange={handleChange} required value={shippingAddress.line1} />
            </label>
            <label className="sm:col-span-2">
              <span className="label">Address line 2</span>
              <input className="input" name="line2" onChange={handleChange} value={shippingAddress.line2} />
            </label>
            <label>
              <span className="label">City</span>
              <input className="input" name="city" onChange={handleChange} required value={shippingAddress.city} />
            </label>
            <label>
              <span className="label">State</span>
              <input className="input" name="state" onChange={handleChange} required value={shippingAddress.state} />
            </label>
            <label>
              <span className="label">Country</span>
              <input className="input" name="country" onChange={handleChange} value={shippingAddress.country} />
            </label>
            <label>
              <span className="label">Landmark</span>
              <input className="input" name="landmark" onChange={handleChange} value={shippingAddress.landmark} />
            </label>
            <label className="sm:col-span-2">
              <span className="label">Order notes</span>
              <textarea
                className="input min-h-28 resize-y"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Delivery notes, preferred timing, or special request"
                value={notes}
              />
            </label>
          </div>

          <div className="mt-8">
            <span className="label">Payment method</span>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`rounded-[24px] border p-5 transition ${paymentMethod === 'razorpay' ? 'border-ember-400 bg-amber-50' : 'border-white/60 bg-white/70'}`}>
                <input
                  checked={paymentMethod === 'razorpay'}
                  className="sr-only"
                  name="paymentMethod"
                  onChange={() => setPaymentMethod('razorpay')}
                  type="radio"
                />
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Pay online</p>
                <p className="mt-2 font-display text-2xl font-bold text-coal-900">Razorpay</p>
                <p className="mt-2 text-sm leading-6 text-coal-700">
                  Pay now with cards, UPI, net banking, or wallets.
                </p>
              </label>
              <label className={`rounded-[24px] border p-5 transition ${paymentMethod === 'cod' ? 'border-ember-400 bg-amber-50' : 'border-white/60 bg-white/70'}`}>
                <input
                  checked={paymentMethod === 'cod'}
                  className="sr-only"
                  name="paymentMethod"
                  onChange={() => setPaymentMethod('cod')}
                  type="radio"
                />
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Pay later</p>
                <p className="mt-2 font-display text-2xl font-bold text-coal-900">Cash on Delivery</p>
                <p className="mt-2 text-sm leading-6 text-coal-700">
                  Place the order now and pay in cash at delivery time.
                </p>
              </label>
            </div>
          </div>

          <Button className="mt-8 w-full" disabled={processing} type="submit" variant="accent">
            {processing
              ? paymentMethod === 'cod'
                ? 'Placing order...'
                : 'Preparing payment...'
              : paymentMethod === 'cod'
                ? 'Place COD order'
                : 'Pay with Razorpay'}
          </Button>
        </form>

        <aside className="glass-card h-fit p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Order summary</p>
          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4 rounded-[24px] bg-amber-50 p-4">
                <div>
                  <p className="font-bold text-coal-900">{item.name}</p>
                  <p className="text-sm text-coal-600">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="font-bold text-coal-900">{formatCurrency(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4 text-sm text-coal-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(cart.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(cart.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-ember-200 pt-4 text-lg font-bold text-coal-900">
              <span>Total payable</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
