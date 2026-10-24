import clsx from 'clsx';

import { ORDER_STATUS_STYLES } from './config';

export const cn = (...inputs) => clsx(inputs);

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : '--';

export const statusBadgeClass = (status) =>
  ORDER_STATUS_STYLES[status] || 'bg-slate-100 text-slate-800';

export const formatPaymentMethod = (provider) => {
  if (provider === 'cod') {
    return 'Cash on Delivery';
  }

  if (provider === 'razorpay') {
    return 'Razorpay';
  }

  return provider || '--';
};

export const formatLabel = (value) =>
  value
    ? value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : '--';

export const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

export const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) {
    return 0;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
};
