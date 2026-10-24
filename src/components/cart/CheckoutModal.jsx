'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { STORE_CONFIG, generateWhatsAppOrderUrl } from '@/lib/constants';

export default function CheckoutModal() {
  const { 
    cartItems, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    clearCart, 
    totalMrp, 
    finalAmount, 
    totalSavings,
    totalCount 
  } = useCart();
  const { settings: storeSettings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [submittedOrderRef, setSubmittedOrderRef] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in your Name, WhatsApp Phone, Address and City.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Post to database for admin order recording & automatic stock decrement
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          whatsappNumber: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          items: cartItems,
          totalMrp,
          totalSavings,
          finalAmount
        })
      });

      const data = await res.json();
      const orderRef = data.orderRef || `SR-${Date.now().toString().slice(-6)}`;
      setSubmittedOrderRef(orderRef);

      // 2. Generate WhatsApp receipt URL using the dynamically configured owner number & store contacts
      const whatsappUrl = generateWhatsAppOrderUrl({
        orderRef,
        customer: formData,
        items: cartItems,
        totalMrp,
        totalSavings,
        finalAmount,
        targetWhatsAppNumber: storeSettings.whatsapp_number,
        storeSettings: storeSettings
      });
      setGeneratedWhatsAppUrl(whatsappUrl);

      // 3. Open WhatsApp (compatible with iOS, Android & Desktop)
      window.location.href = whatsappUrl;

      // 4. Update UI state and clear cart
      setOrderCompleted(true);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      const fallbackRef = `SR-${Date.now().toString().slice(-6)}`;
      const whatsappUrl = generateWhatsAppOrderUrl({
        orderRef: fallbackRef,
        customer: formData,
        items: cartItems,
        totalMrp,
        totalSavings,
        finalAmount,
        targetWhatsAppNumber: storeSettings.whatsapp_number,
        storeSettings: storeSettings
      });
      setGeneratedWhatsAppUrl(whatsappUrl);
      window.location.href = whatsappUrl;
      setSubmittedOrderRef(fallbackRef);
      setOrderCompleted(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm transition-opacity"
        onClick={() => !orderCompleted && setIsCheckoutOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 z-10 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsCheckoutOpen(false);
            setOrderCompleted(false);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {orderCompleted ? (
          /* Order Confirmation View */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Order Sent to WhatsApp!</h3>
              <p className="text-xs text-slate-500">
                Order Reference: <strong className="text-sky-800 font-mono text-sm">#{submittedOrderRef}</strong>
              </p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 text-xs text-left text-slate-700 space-y-2 border border-sky-100">
              <div className="flex justify-between font-bold text-sky-950 pb-1 border-b border-sky-200">
                <span>Total Items Ordered:</span>
                <span>{totalCount} products</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Final Payable Amount:</span>
                <span>₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Your order receipt has been prepared and sent to <strong>{storeSettings.shop_name}</strong> WhatsApp (+91 {storeSettings.whatsapp_number}). Our dispatch desk at {storeSettings.address} will confirm order packing and share tracking details.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={generatedWhatsAppUrl || `https://wa.me/91${storeSettings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Open WhatsApp Now (+91 {storeSettings.whatsapp_number})</span>
              </a>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setOrderCompleted(false);
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step Form */
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-amber-400 text-white flex items-center justify-center shadow-md">
                <Send className="w-5 h-5 text-yellow-100" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">WhatsApp Direct Checkout</h3>
                <p className="text-xs text-slate-500">
                  Instant receipt sent directly to {storeSettings.shop_name} admin (No payment gateway needed)
                </p>
              </div>
            </div>

            {/* Bill Summary Strip */}
            <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-100/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Total MRP Value:</span>
                <span className="line-through text-slate-400 font-bold">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-emerald-700 font-bold block">80% Factory Savings:</span>
                <span className="text-emerald-700 font-black">-₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Final Net Price:</span>
                <span className="text-base font-black text-sky-950">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Customer Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Active WhatsApp Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-green-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit WhatsApp number (e.g. 9876543210)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <textarea
                    name="address"
                    required
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Door / House no, Street, Area or Landmark"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Chennai, Madurai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 600001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Special Notes / Request (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Please pack in water-proof carton"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Order...' : 'Submit & Open WhatsApp Order'}</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Zero online payment risk • Verified manually by {storeSettings.shop_name} Sivakasi
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
