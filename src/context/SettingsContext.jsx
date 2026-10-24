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
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const [settingsRes, branchesRes] = await Promise.all([
        fetch('/api/settings', { cache: 'no-store' }),
        fetch('/api/branches', { cache: 'no-store' })
      ]);

      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setSettings(prev => ({
          ...prev,
          shop_name: settingsData.settings.shop_name || prev.shop_name,
          whatsapp_number: settingsData.settings.whatsapp_number || prev.whatsapp_number,
          secondary_phone: settingsData.settings.secondary_phone || prev.secondary_phone,
          address: settingsData.settings.address || prev.address
        }));
      }

      const branchesData = await branchesRes.json();
      if (branchesData.success && Array.isArray(branchesData.branches)) {
        setBranches(branchesData.branches);
      }
    } catch (e) {
      console.error('Failed to fetch dynamic settings or branches', e);
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
    branches,
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
      branches: [],
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
