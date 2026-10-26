'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  ExternalLink, 
  Upload, 
  Loader2, 
  ImageIcon, 
  Layers, 
  Printer, 
  FileText, 
  Award,
  Sparkles,
  Percent,
  Check,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function CalendarManager({ onNotification = () => {} }) {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const CALENDAR_TYPE_PRESETS = [
    'Wirebound / Spiral Flip Wall',
    'Tear-Off / Daily Slip',
    'Single-Sheet Poster Planner',
    'Desk & Tabletop'
  ];

  const PRESET_IMAGES = [
    { label: 'Daily Slip Pad (Gold Foil)', path: '/images/calendars/daily-slip-calendar.jpg' },
    { label: 'Wirebound Spiral Wall (170 GSM)', path: '/images/calendars/spiral-wall-calendar.svg' },
    { label: 'Single-Sheet Poster (A2/A3)', path: '/images/calendars/poster-wall-calendar.svg' },
    { label: 'Desk Tabletop Tent (300 GSM)', path: '/images/calendars/desk-tent-calendar.svg' }
  ];

  const [form, setForm] = useState({
    name: '',
    tamilName: '',
    type: 'Wirebound / Spiral Flip Wall',
    paperGsm: '170 GSM Premium Gloss Art Paper',
    size: '12" x 18" Wall Flip',
    originalPrice: 250,
    price: 120,
    stock: 200,
    inStock: true,
    image: '/images/calendars/spiral-wall-calendar.svg',
    description: '',
    featuresList: [
      'High-resolution multi-color Sivakasi offset printing',
      'Tamil Panchangam, Nalla Neram & Auspicious Festival dates'
    ],
    minOrderQty: 1,
    featured: true,
    sortOrder: 1
  });

  const loadCalendars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/calendars?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.calendars)) {
        setCalendars(data.calendars);
      }
    } catch (err) {
      console.error('Failed to load calendars', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingCalendar(null);
    setForm({
      name: '',
      tamilName: '',
      type: 'Wirebound / Spiral Flip Wall',
      paperGsm: '170 GSM Premium Gloss Art Paper',
      size: '12" x 18" Wall Flip',
      originalPrice: 250,
      price: 120,
      stock: 200,
      inStock: true,
      image: '/images/calendars/spiral-wall-calendar.svg',
      description: '',
      featuresList: [
        'High-resolution multi-color Sivakasi offset printing',
        'Tamil Panchangam, Nalla Neram & Auspicious Festival dates'
      ],
      minOrderQty: 1,
      featured: true,
      sortOrder: calendars.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cal) => {
    setModalMode('edit');
    setEditingCalendar(cal);
    let parsedFeatures = [];
    try {
      parsedFeatures = typeof cal.features === 'string' ? JSON.parse(cal.features) : (cal.features || []);
    } catch (e) {
      parsedFeatures = [];
    }

    setForm({
      name: cal.name || '',
      tamilName: cal.tamilName || '',
      type: cal.type || 'Wirebound / Spiral Flip Wall',
      paperGsm: cal.paperGsm || '130 to 170 GSM Art Paper',
      size: cal.size || 'Standard',
      originalPrice: cal.originalPrice || 0,
      price: cal.price || 0,
      stock: cal.stock !== undefined ? cal.stock : 100,
      inStock: Boolean(cal.inStock),
      image: cal.image || '/images/calendars/daily-slip-calendar.jpg',
      description: cal.description || '',
      featuresList: parsedFeatures.length > 0 ? parsedFeatures : ['Direct Sivakasi Press Quality'],
      minOrderQty: cal.minOrderQty || 1,
      featured: Boolean(cal.featured),
      sortOrder: cal.sortOrder || 0
    });
    setIsModalOpen(true);
  };

  const handleFeatureChange = (index, value) => {
    const next = [...form.featuresList];
    next[index] = value;
    setForm(prev => ({ ...prev, featuresList: next }));
  };

  const addFeatureField = () => {
    setForm(prev => ({ ...prev, featuresList: [...prev.featuresList, ''] }));
  };

  const removeFeatureField = (index) => {
    setForm(prev => ({
      ...prev,
      featuresList: prev.featuresList.filter((_, i) => i !== index)
    }));
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
        onNotification('Photo uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Photo upload failed. Please try again or use direct image path.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || form.price === undefined) {
      alert('Calendar name and selling price are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        tamilName: form.tamilName.trim(),
        type: form.type,
        paperGsm: form.paperGsm.trim(),
        size: form.size.trim(),
        originalPrice: Number(form.originalPrice) || 0,
        price: Number(form.price),
        stock: Number(form.stock) >= 0 ? Number(form.stock) : 0,
        inStock: Boolean(form.inStock),
        image: form.image,
        description: form.description.trim(),
        features: form.featuresList.filter(f => f && f.trim() !== ''),
        minOrderQty: Number(form.minOrderQty) || 1,
        featured: Boolean(form.featured),
        sortOrder: Number(form.sortOrder) || 0
      };

      const url = modalMode === 'create' ? '/api/calendars' : `/api/calendars/${editingCalendar.id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadCalendars();
        onNotification(
          modalMode === 'create'
            ? 'New Calendar product created successfully!'
            : 'Calendar product updated successfully!'
        );
      } else {
        alert(data.error || 'Failed to save calendar product.');
      }
    } catch (err) {
      console.error('Error saving calendar', err);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete calendar: "${name}"?`)) return;

    try {
      const res = await fetch(`/api/calendars/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCalendars(prev => prev.filter(c => c.id !== id));
        onNotification('Calendar product deleted successfully.');
      } else {
        alert(data.error || 'Failed to delete calendar.');
      }
    } catch (err) {
      console.error('Error deleting calendar', err);
      alert('Delete failed.');
    }
  };

  const handleToggleStock = async (cal) => {
    try {
      const nextStockState = !cal.inStock;
      const res = await fetch(`/api/calendars/${cal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: nextStockState })
      });
      const data = await res.json();
      if (data.success) {
        setCalendars(prev => prev.map(c => c.id === cal.id ? { ...c, inStock: nextStockState } : c));
        onNotification(`Calendar ${cal.name} set to ${nextStockState ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (err) {
      console.error('Stock toggle failed', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/80 via-[#043329] to-emerald-950/80 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20 font-black">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider mb-1 border border-emerald-400/40">
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Sivakasi Calendar Production Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Calendar Varieties &amp; Pricing Configuration
            </h2>
            <p className="text-xs text-emerald-200">
              Manage Daily Tear-Off Slips, Spiral Wall Flips, Poster Planners, photos, and direct press rates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/calendars"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-950" />
            <span>Add New Calendar Variety</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Varieties</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">{calendars.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium block">Configured for 2026</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available In Stock</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {calendars.filter(c => c.inStock).length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium block">Ready to order</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Unified Cart</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">Active</p>
          <span className="text-[10px] text-slate-500 font-medium block">Pairs with fireworks checkout</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Paper Specs (GSM)</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">130 - 300</p>
          <span className="text-[10px] text-slate-500 font-medium block">High quality art paper</span>
        </div>
      </div>

      {/* Calendars Data Table / Cards */}
      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Active Calendar Products ({calendars.length})</span>
          </h3>

          <button
            onClick={loadCalendars}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            <span>Loading calendar catalog...</span>
          </div>
        ) : calendars.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-40 text-emerald-600" />
            <p className="font-bold text-slate-700">No calendars configured yet.</p>
            <p className="text-xs text-slate-500 mb-4">Click below to add your first calendar product.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Add First Calendar
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Name &amp; Type</th>
                  <th className="py-3 px-4">Paper Specs / Size</th>
                  <th className="py-3 px-4">Rates (MRP / Net)</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calendars.map(cal => {
                  const discount = cal.originalPrice > cal.price
                    ? Math.round(((cal.originalPrice - cal.price) / cal.originalPrice) * 100)
                    : 0;

                  return (
                    <tr key={cal.id} className="hover:bg-emerald-50/40 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={cal.image || '/images/calendars/daily-slip-calendar.jpg'}
                            alt={cal.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = '/images/calendars/daily-slip-calendar.jpg'; }}
                          />
                        </div>
                      </td>

                      {/* Name & Type */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{cal.name}</div>
                        {cal.tamilName && (
                          <div className="text-emerald-700 font-bold text-xs">{cal.tamilName}</div>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {cal.type}
                        </span>
                      </td>

                      {/* Specs */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{cal.paperGsm || 'Art Paper'}</div>
                        <div className="text-[11px] text-slate-500">{cal.size || 'Standard'}</div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-black text-sm text-slate-900">₹{cal.price}</span>
                          {cal.originalPrice > cal.price && (
                            <span className="text-[11px] text-slate-400 line-through">₹{cal.originalPrice}</span>
                          )}
                        </div>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            {discount}% OFF
                          </span>
                        )}
                      </td>

                      {/* Stock Units */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {cal.stock} units
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(cal)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 border transition-all ${
                            cal.inStock
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cal.inStock ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          <span>{cal.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cal)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-sky-50 text-sky-700 hover:border-sky-300 transition-colors"
                            title="Edit calendar details and price"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cal.id, cal.name)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-700 hover:border-rose-300 transition-colors"
                            title="Delete calendar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT CALENDAR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-100 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">
                  {modalMode === 'create' ? 'Add New Calendar Variety' : `Edit: ${editingCalendar?.name}`}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* English & Tamil Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calendar Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Wirebound Spiral Flip Wall Calendar 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">காலண்டர் பெயர் (Tamil)</label>
                  <input
                    type="text"
                    value={form.tamilName}
                    onChange={(e) => setForm(prev => ({ ...prev, tamilName: e.target.value }))}
                    placeholder="e.g. 12 மாத ஸ்பைரல் வால் காலண்டர்"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Type & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calendar Format / Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {CALENDAR_TYPE_PRESETS.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dimensions / Size *</label>
                  <input
                    type="text"
                    required
                    value={form.size}
                    onChange={(e) => setForm(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="e.g. 12 x 18 Wall Flip, A2 Poster, 7 x 10 Slip"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Paper GSM & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paper Specification (GSM) *</label>
                  <input
                    type="text"
                    required
                    value={form.paperGsm}
                    onChange={(e) => setForm(prev => ({ ...prev, paperGsm: e.target.value }))}
                    placeholder="e.g. 170 GSM Premium Gloss Art Paper"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity (Units) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      setForm(prev => ({ ...prev, stock: s, inStock: s > 0 }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    step="1"
                    value={form.originalPrice}
                    onChange={(e) => setForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-800 mb-1">Selling Net Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    value={form.price}
                    onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-400 focus:ring-2 focus:ring-emerald-500 font-black text-emerald-950 text-sm"
                  />
                </div>
              </div>

              {/* Photo & Preset Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Calendar Photograph / Graphic *</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-20 h-20 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/images/calendars/daily-slip-calendar.jpg'; }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm">
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Calendar Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">or pick from standard Sivakasi press graphics:</span>
                    </div>

                    {/* Presets Quick Picker */}
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, image: preset.path }))}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            form.image === preset.path
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-1 ring-emerald-400'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="/images/calendars/..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Details</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details about pages, Tamil panchangam, auspicious dates, finish..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Features List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Highlight Features (Bullets)</label>
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {form.featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature #${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                      />
                      {form.featuresList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* In Stock & Featured Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded text-emerald-600 h-4 w-4"
                  />
                  <span className="font-bold text-slate-700">In Stock for Public Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded text-emerald-600 h-4 w-4"
                  />
                  <span className="font-bold text-slate-700">Featured Highlight</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Calendar Variety'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
