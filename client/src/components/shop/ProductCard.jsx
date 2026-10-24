import { Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { formatCurrency, getDiscountPercent } from '../../lib/utils';
import Button from '../ui/Button';

const ProductCard = ({ product }) => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const discount = getDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = async () => {
    if (!isAuthenticated || user?.role !== 'user') {
      return;
    }

    await addToCart(product._id, product.minOrderQuantity || 1);
  };

  return (
    <article className="group glass-card overflow-hidden transition duration-300 hover:-translate-y-1">
      <Link className="block overflow-hidden" to={`/shop/${product.slug}`}>
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-amber-100 via-white to-gold-50">
          <img
            alt={product.image?.alt || product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={product.image?.url}
          />
          {discount ? (
            <span className="absolute left-4 top-4 rounded-full bg-ember-600 px-3 py-1 text-xs font-bold text-white shadow-md">
              Save {discount}%
            </span>
          ) : null}
          <span className={`absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs font-bold uppercase ${
            product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-700'
          }`}>
            {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
          </span>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {product.categories?.slice(0, 2).map((category) => (
            <span
              key={category}
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ember-700"
            >
              {category}
            </span>
          ))}
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-coal-900">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-coal-700">{product.shortDescription}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-extrabold text-coal-900">{formatCurrency(product.price)}</p>
            {product.originalPrice ? (
              <p className="text-sm text-coal-500 line-through">{formatCurrency(product.originalPrice)}</p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coal-500">Minimum</p>
            <p className="text-sm font-bold text-coal-900">{product.minOrderQuantity || 1} pack</p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button as={Link} className="flex-1" to={`/shop/${product.slug}`} variant="soft">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            className="flex-1"
            disabled={!isAuthenticated || user?.role !== 'user' || product.stock <= 0}
            onClick={handleAddToCart}
            variant="accent"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
