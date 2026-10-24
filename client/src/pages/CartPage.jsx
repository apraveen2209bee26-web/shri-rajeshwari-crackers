import { Link } from 'react-router-dom';

import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../lib/utils';

const CartPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart, updateItemQuantity, removeItem } = useCart();

  if (!isAuthenticated || user?.role !== 'user') {
    return (
      <div className="shell py-14">
        <EmptyState
          action={
            <Button as={Link} to="/login" variant="accent">
              Login to continue
            </Button>
          }
          description="User login is required to use the cart and checkout flow."
          title="Please sign in first"
        />
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="shell py-14">
        <EmptyState
          action={
            <Button as={Link} to="/shop" variant="accent">
              Continue shopping
            </Button>
          }
          description="Your cart is empty right now. Explore the catalog and add your favorite festive products."
          title="No items in cart"
        />
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {cart.items.map((item) => (
            <article key={item.productId} className="glass-card flex flex-col gap-5 p-5 sm:flex-row">
              <img
                alt={item.name}
                className="h-32 w-full rounded-[24px] object-cover sm:w-36"
                src={item.image?.url}
              />
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember-700">
                    {item.categories?.join(' / ')}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-coal-900">{item.name}</h2>
                  <p className="mt-2 text-sm text-coal-600">{formatCurrency(item.price)} each</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-coal-700">Qty</span>
                    <input
                      className="input w-24"
                      min="1"
                      onChange={(event) => updateItemQuantity(item.productId, Number(event.target.value))}
                      type="number"
                      value={item.quantity}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-extrabold text-coal-900">{formatCurrency(item.subtotal)}</p>
                    <button
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                      onClick={() => removeItem(item.productId)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="glass-card h-fit p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Order summary</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-coal-900">Ready to checkout</h2>
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
              <span>Total</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
          </div>
          <Button as={Link} className="mt-8 w-full" to="/checkout" variant="accent">
            Proceed to checkout
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
