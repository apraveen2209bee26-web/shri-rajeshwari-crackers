'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sri_rajeshwari_cart') || localStorage.getItem('sri_rajeshwari_cart') || localStorage.getItem('sachin_pyrotech_cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse cart storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sri_rajeshwari_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to store cart', e);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        if (newQty <= 0) {
          return prev.filter(item => item.id !== product.id);
        }
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      } else {
        if (quantity <= 0) return prev;
        return [...prev, {
          id: product.id,
          sNo: product.sNo,
          name: product.name,
          tamilName: product.tamilName,
          category: product.category,
          unit: product.unit || '1 Box',
          originalPrice: Number(product.originalPrice),
          price: Number(product.price),
          image: product.image,
          quantity: quantity
        }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.id !== productId);
      }
      return prev.map(item => item.id === productId ? { ...item, quantity } : item);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Calculations
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalMrp = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const finalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = Math.max(0, totalMrp - finalAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemQuantity,
      totalCount,
      totalMrp,
      finalAmount,
      totalSavings,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
