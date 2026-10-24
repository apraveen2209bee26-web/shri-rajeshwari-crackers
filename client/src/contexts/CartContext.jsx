import { createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '../api';
import { useAuth } from '../hooks/useAuth';

const defaultCart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  shippingFee: 0,
  tax: 0,
  total: 0,
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(defaultCart);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated || user?.role !== 'user') {
      setCart(defaultCart);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data.cart);
    } catch (_error) {
      setCart(defaultCart);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user?.role]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await api.addCartItem({ productId, quantity });
    setCart(data.cart);
    toast.success(data.message);
  };

  const updateItemQuantity = async (productId, quantity) => {
    const data = await api.updateCartItem(productId, { quantity });
    setCart(data.cart);
  };

  const removeItem = async (productId) => {
    const data = await api.removeCartItem(productId);
    setCart(data.cart);
    toast.success(data.message);
  };

  const clearCart = async () => {
    const data = await api.clearCart();
    setCart(data.cart);
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      fetchCart,
      addToCart,
      updateItemQuantity,
      removeItem,
      clearCart,
    }),
    [cart, loading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

