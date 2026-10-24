import { Minus, Plus, ShieldCheck, ShoppingCart, Sparkles, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { api } from '../api';
import ProductCard from '../components/shop/ProductCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../lib/utils';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductBySlug(slug);
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts);
        setQuantity(data.product.minOrderQuantity || 1);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return <Loader label="Loading product details..." />;
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated || user?.role !== 'user') {
      navigate('/login');
      return;
    }

    await addToCart(product._id, quantity);
  };

  return (
    <div className="shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="glass-card overflow-hidden bg-white">
          <div className="h-[420px] overflow-hidden bg-gradient-to-br from-amber-100 via-white to-orange-50">
            <img alt={product.image?.alt || product.name} className="h-full w-full object-cover" src={product.image?.url} />
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex flex-wrap gap-2">
            {product.categories?.map((category) => (
              <span
                key={category}
                className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ember-700"
              >
                {category}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">{product.name}</h1>
          <p className="mt-4 text-base leading-8 text-coal-700">{product.description}</p>

          <div className="mt-6 flex items-end gap-4">
            <p className="text-4xl font-extrabold text-coal-900">{formatCurrency(product.price)}</p>
            {product.originalPrice ? (
              <p className="pb-1 text-lg text-coal-500 line-through">{formatCurrency(product.originalPrice)}</p>
            ) : null}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              className="rounded-full bg-white p-3 shadow-sm"
              onClick={() => setQuantity((current) => Math.max(product.minOrderQuantity || 1, current - 1))}
              type="button"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="rounded-full bg-amber-50 px-6 py-3 text-sm font-bold text-coal-900">{quantity}</span>
            <button
              className="rounded-full bg-white p-3 shadow-sm"
              onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
            <Button className="ml-2 flex-1" onClick={handleAddToCart} variant="accent">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['Live stock', `${product.stock} available`, Sparkles],
              ['Safe checkout', 'Razorpay payment', ShieldCheck],
              ['Order updates', 'Track after purchase', Truck],
            ].map(([title, value, Icon]) => (
              <div key={title} className="rounded-[24px] bg-amber-50 p-5">
                <Icon className="h-5 w-5 text-ember-600" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-coal-500">{title}</p>
                <p className="mt-2 text-sm font-bold text-coal-900">{value}</p>
              </div>
            ))}
          </div>

          {product.highlights?.length ? (
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-coal-600">Highlights</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-coal-700">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>- {highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8">
            <Button as={Link} to="/shop" variant="ghost">
              Back to catalog
            </Button>
          </div>
        </div>
      </div>

      {relatedProducts.length ? (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember-700">You may also like</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-coal-900">Related festival picks</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ProductDetailsPage;
