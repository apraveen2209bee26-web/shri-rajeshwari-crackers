'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORE_CONFIG } from '@/lib/constants';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    shop_name: STORE_CONFIG.name,
    whatsapp_number: STORE_CONFIG.whatsappNumber,
    secondary_phone: STORE_CONFIG.secondaryPhone,
    address: STORE_CONFIG.address,
    email: STORE_CONFIG.email || 'rajeshwaricrackers@gmail.com',
    tagline: STORE_CONFIG.tagline || 'Light Up the Celebration',
    motto: STORE_CONFIG.motto || 'ஸ்ரீ முருகன் துணை'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(prev => ({
          ...prev,
          shop_name: data.settings.shop_name || prev.shop_name,
          whatsapp_number: data.settings.whatsapp_number || prev.whatsapp_number,
          secondary_phone: data.settings.secondary_phone || prev.secondary_phone,
          address: data.settings.address || prev.address
        }));
      }
    } catch (e) {
      console.error('Failed to fetch dynamic settings', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Clean numbers
  const cleanWa = (settings.whatsapp_number || STORE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
  const cleanSec = (settings.secondary_phone || STORE_CONFIG.secondaryPhone).replace(/[^0-9]/g, '');

  const formatPhone = (num) => {
    const d = (num || '').replace(/[^0-9]/g, '');
    if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
    return num ? `+91 ${num}` : '';
  };

  const whatsappDisplay = formatPhone(cleanWa);
  const secondaryPhoneDisplay = formatPhone(cleanSec);

  const whatsappUrl = `https://wa.me/91${cleanWa}?text=${encodeURIComponent(
    `Hello ${settings.shop_name || 'Shri Rajeshwari Crackers'}, I would like to inquire about fireworks availability and orders.`
  )}`;

  const value = {
    settings,
    loading,
    refreshSettings: fetchSettings,
    cleanWaNumber: cleanWa,
    cleanSecPhone: cleanSec,
    whatsappUrl,
    whatsappDisplay,
    secondaryPhoneDisplay
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    const cleanWa = STORE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanSec = STORE_CONFIG.secondaryPhone.replace(/[^0-9]/g, '');
    return {
      settings: {
        shop_name: STORE_CONFIG.name,
        whatsapp_number: STORE_CONFIG.whatsappNumber,
        secondary_phone: STORE_CONFIG.secondaryPhone,
        address: STORE_CONFIG.address,
      },
      loading: false,
      refreshSettings: () => {},
      cleanWaNumber: cleanWa,
      cleanSecPhone: cleanSec,
      whatsappUrl: `https://wa.me/91${cleanWa}?text=${encodeURIComponent('Hello Shri Rajeshwari Crackers, I would like to inquire about fireworks availability and orders.')}`,
      whatsappDisplay: STORE_CONFIG.whatsappDisplay,
      secondaryPhoneDisplay: STORE_CONFIG.secondaryPhoneDisplay
    };
  }
  return context;
}
