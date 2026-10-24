'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  ImageIcon, 
  Loader2, 
  Save, 
  X, 
  ExternalLink, 
  Sparkles, 
  Tag, 
  Package, 
  ArrowRight,
  Calculator,
  Search,
  CheckCircle,
  PlusCircle
} from 'lucide-react';

export default function ComboManager({ products = [], onNotification = () => {} }) {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingCombo, setEditingCombo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [comboForm, setComboForm] = useState({
    title: '',
    tamilTitle: '',
    badge: 'MEGA SAVER',
    image: '/images/illustration-diwali-crackers.avif',
    description: '',
    highlights: ['62 Premium Fireworks Items', '1000 Wala & King of King Bomb', 'Multiple Aerial Repeating Shots', '100% Sivakasi Standard'],
    items: [],
    totalMarketPrice: 0,
    offerPrice: 5000,
    active: true,
    sortOrder: 0
  });

  // State for product selector inside modal
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('1 BOX');
  const [productSearch, setProductSearch] = useState('');

  const loadCombos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/combos?all=true');
      const data = await res.json();
      if (data.success && data.combos) {
        setCombos(data.combos);
      }
    } catch (err) {
      console.error('Failed to load combo offers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  // Recalculate Total Market MRP whenever items change
  const calculateTotalMarketPrice = (itemsList) => {
    return itemsList.reduce((acc, it) => {
      const orig = Number(it.originalPrice) || 0;
      const qty = Number(it.quantity) || 1;
      return acc + (orig * qty);
    }, 0);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingCombo(null);
    setComboForm({
      title: '',
      tamilTitle: '',
      badge: 'MEGA SAVER',
      image: '/images/illustration-diwali-crackers.avif',
      description: '',
      highlights: ['Special Festival Assortment', 'Best Family Value Pack', '100% Genuine Sivakasi Crackers'],
      items: [],
      totalMarketPrice: 0,
      offerPrice: 3000,
      active: true,
      sortOrder: combos.length
    });
    setSelectedProductId(products[0]?.id || '');
    setSelectedQty(1);
    setSelectedUnit(products[0]?.unit || '1 BOX');
    setIsModalOpen(true);
  };

  const openEditModal = (combo) => {
    setModalMode('edit');
    setEditingCombo(combo);

    let parsedItems = [];
    try {
      parsedItems = typeof combo.itemsJson === 'string' ? JSON.parse(combo.itemsJson) : (combo.itemsJson || []);
    } catch (e) {
      parsedItems = [];
    }

    let parsedHighlights = [];
    try {
      parsedHighlights = typeof combo.highlights === 'string' ? JSON.parse(combo.highlights) : (combo.highlights || []);
    } catch (e) {
      parsedHighlights = typeof combo.highlights === 'string' ? combo.highlights.split(',').map(s => s.trim()) : [];
    }

    const calculatedTotal = calculateTotalMarketPrice(parsedItems);

    setComboForm({
      title: combo.title || '',
      tamilTitle: combo.tamilTitle || '',
      badge: combo.badge || 'MEGA SAVER',
      image: combo.image || '/images/illustration-diwali-crackers.avif',
      description: combo.description || '',
      highlights: parsedHighlights,
      items: parsedItems,
      totalMarketPrice: combo.totalMarketPrice || calculatedTotal,
      offerPrice: combo.offerPrice || 0,
      active: combo.active !== undefined ? combo.active : true,
      sortOrder: combo.sortOrder || 0
    });

    setSelectedProductId(products[0]?.id || '');
    setSelectedQty(1);
    setSelectedUnit(products[0]?.unit || '1 BOX');
    setIsModalOpen(true);
  };

  // Add Product to Combo items list
  const handleAddProductToCombo = () => {
    const prod = products.find(p => String(p.id) === String(selectedProductId));
    if (!prod) return;

    const qty = Math.max(1, Number(selectedQty) || 1);
    const newItem = {
      sNo: prod.sNo || comboForm.items.length + 1,
      productId: prod.id,
      name: prod.name,
      tamilName: prod.tamilName || '',
      quantity: qty,
      unit: selectedUnit || prod.unit || '1 BOX',
      originalPrice: prod.originalPrice || 0,
      price: prod.price || 0
    };

    const updatedItems = [...comboForm.items, newItem];
    const newTotalMarket = calculateTotalMarketPrice(updatedItems);

    setComboForm(prev => ({
      ...prev,
      items: updatedItems,
      totalMarketPrice: newTotalMarket
    }));

    onNotification(`Added ${prod.name} (${qty}x) to combo!`);
  };

  // Remove Item from Combo
  const handleRemoveItem = (index) => {
    const updated = comboForm.items.filter((_, idx) => idx !== index);
    const newTotal = calculateTotalMarketPrice(updated);
    setComboForm(prev => ({
      ...prev,
      items: updated,
      totalMarketPrice: newTotal
    }));
  };

  // Update Item Quantity in Combo
  const handleItemQtyChange = (index, newQty) => {
    const qty = Math.max(1, Number(newQty) || 1);
    const updated = comboForm.items.map((it, idx) => {
      if (idx === index) {
        return { ...it, quantity: qty };
      }
      return it;
    });
    const newTotal = calculateTotalMarketPrice(updated);
    setComboForm(prev => ({
      ...prev,
      items: updated,
      totalMarketPrice: newTotal
    }));
  };

  // Upload image
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setComboForm(prev => ({ ...prev, image: data.url }));
        onNotification('Combo poster uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading photo');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Combo Form
  const handleSaveCombo = async (e) => {
    e.preventDefault();
    if (!comboForm.title.trim()) {
      alert('Please enter a combo offer title.');
      return;
    }
    if (comboForm.offerPrice === undefined || comboForm.offerPrice === null) {
      alert('Please enter the revised festival offer price.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: comboForm.title,
        tamilTitle: comboForm.tamilTitle,
        badge: comboForm.badge,
        image: comboForm.image,
        description: comboForm.description,
        highlights: comboForm.highlights,
        itemsJson: JSON.stringify(comboForm.items),
        itemsCount: comboForm.items.length,
        totalMarketPrice: Number(comboForm.totalMarketPrice) || calculateTotalMarketPrice(comboForm.items),
        offerPrice: Number(comboForm.offerPrice),
        active: Boolean(comboForm.active),
        sortOrder: Number(comboForm.sortOrder) || 0
      };

      if (modalMode === 'create') {
        const res = await fetch('/api/combos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.combo) {
          setCombos(prev => [...prev, data.combo]);
          onNotification(`New Combo Offer "${data.combo.title}" created successfully!`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Failed to create combo offer');
        }
      } else {
        const res = await fetch(`/api/combos/${editingCombo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.combo) {
          setCombos(prev => prev.map(c => c.id === editingCombo.id ? data.combo : c));
          onNotification(`Combo Offer "${data.combo.title}" updated successfully!`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Failed to update combo offer');
        }
      }
    } catch (err) {
      console.error('Save combo error:', err);
      alert('Error saving combo offer');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Combo Active Status
  const handleToggleActive = async (combo) => {
    const newStatus = !combo.active;
    try {
      const res = await fetch(`/api/combos/${combo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newStatus })
      });
      if (res.ok) {
        setCombos(prev => prev.map(c => c.id === combo.id ? { ...c, active: newStatus } : c));
        onNotification(`Combo "${combo.title}" is now ${newStatus ? 'Visible on storefront' : 'Hidden from storefront'}.`);
      }
    } catch (e) {
      alert('Failed to update combo status');
    }
  };

  // Delete Combo
  const handleDeleteCombo = async (combo) => {
    if (!confirm(`Are you sure you want to permanently delete combo offer "${combo.title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/combos/${combo.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCombos(prev => prev.filter(c => c.id !== combo.id));
        onNotification(`Combo "${combo.title}" deleted.`);
      }
    } catch (e) {
      alert('Failed to delete combo');
    }
  };

  // Filter products for dropdown
  const filteredProductOptions = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.tamilName && p.tamilName.includes(q)) || String(p.sNo) === q;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Combo Offers Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and manage festival cracker bundles. Add products, view automatically calculated total Market MRP, and set your revised offer rate for customers!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/combo-offers"
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>View Public /combo-offers</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Combo Offer</span>
          </button>
        </div>
      </div>

      {/* Combo Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-sm">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
          Loading configured combo offers...
        </div>
      ) : combos.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Combo Offers Configured Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Click &quot;Create New Combo Offer&quot; above to assemble your first mega cracker value pack with products, automatic MRP, and custom revised offer pricing.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Combo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {combos.map((combo) => {
            let itemsCount = combo.itemsCount || 0;
            try {
              if (!itemsCount && combo.itemsJson) {
                const parsed = JSON.parse(combo.itemsJson);
                itemsCount = parsed.length;
              }
            } catch (e) {}

            const savings = Math.max(0, (combo.totalMarketPrice || 0) - (combo.offerPrice || 0));
            const discountPercent = combo.totalMarketPrice > 0 
              ? Math.round((savings / combo.totalMarketPrice) * 100) 
              : 0;

            return (
              <div
                key={combo.id}
                className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  combo.active 
                    ? 'border-sky-100 hover:border-sky-300 shadow-md' 
                    : 'border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar: Badge & Active Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200">
                      ⚡ {combo.badge || 'COMBO OFFER'}
                    </span>

                    <button
                      onClick={() => handleToggleActive(combo)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                        combo.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {combo.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{combo.active ? 'Active on Store' : 'Hidden'}</span>
                    </button>
                  </div>

                  {/* Body: Poster & Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={combo.image || '/images/illustration-diwali-crackers.avif'}
                        alt={combo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/illustration-diwali-crackers.avif'; }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-900 text-base leading-snug truncate">
                        {combo.title}
                      </h3>
                      {combo.tamilTitle && (
                        <p className="text-xs text-slate-600 mt-0.5 truncate font-medium">
                          {combo.tamilTitle}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                          🎁 {itemsCount} Fireworks Items
                        </span>
                        {discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[11px] font-black">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Standard Market MRP
                      </span>
                      <span className="text-sm font-bold text-slate-400 line-through">
                        ₹{(combo.totalMarketPrice || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">
                        Revised Festival Rate
                      </span>
                      <span className="text-xl font-black text-emerald-700">
                        ₹{(combo.offerPrice || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {savings > 0 && (
                    <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Saves customers ₹{savings.toLocaleString('en-IN')} instantly!</span>
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Sort Order: {combo.sortOrder}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(combo)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Edit & Configure</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCombo(combo)}
                      className="p-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all"
                      title="Delete Combo Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT COMBO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 z-10 max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {modalMode === 'create' ? 'Create New Combo Offer' : `Edit Combo: ${editingCombo?.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assemble product items, check total MRP, and define your revised selling price.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-6 text-xs">
              {/* Row 1: Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Combo Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={comboForm.title}
                    onChange={(e) => setComboForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. ₹5000 Mega Combo Value Pack"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    கலவை பெயர் (Tamil Title)
                  </label>
                  <input
                    type="text"
                    value={comboForm.tamilTitle}
                    onChange={(e) => setComboForm(prev => ({ ...prev, tamilTitle: e.target.value }))}
                    placeholder="e.g. தரமான பட்டாசுகள் குறைந்த விலையில்! (62 Items Grand Diwali Pack)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Row 2: Badge, Sort Order & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Highlight Badge Tag
                  </label>
                  <input
                    type="text"
                    value={comboForm.badge}
                    onChange={(e) => setComboForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="MEGA SAVER, SUPER VALUE, FESTIVAL PACK"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={comboForm.sortOrder}
                    onChange={(e) => setComboForm(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={comboForm.active}
                      onChange={(e) => setComboForm(prev => ({ ...prev, active: e.target.checked }))}
                      className="rounded text-sky-600 h-4 w-4"
                    />
                    <span className="font-bold text-slate-800">Active on Storefront</span>
                  </label>
                </div>
              </div>

              {/* Row 3: Poster Picture */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Combo Pack Poster Photo
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-24 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {comboForm.image ? (
                      <img 
                        src={comboForm.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/illustration-diwali-crackers.avif'; }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-sky-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-sm">
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Poster...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Poster from Device</span>
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
                      <span className="text-[11px] text-slate-400">or paste image URL below</span>
                    </div>

                    <input
                      type="text"
                      value={comboForm.image}
                      onChange={(e) => setComboForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="/images/... or https://..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Combo Description & Highlights
                </label>
                <textarea
                  rows={2}
                  value={comboForm.description}
                  onChange={(e) => setComboForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="The ultimate fireworks extravaganza featuring 62 top-tier items! Includes 1000 Wala, King of King Bomb, 12 & 30 Shot Multicolours, Sky Shots..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* PRODUCTS IN COMBO SELECTOR & BUILDER */}
              <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sky-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-sky-700" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Package Products Catalog ({comboForm.items.length} items added)
                    </h4>
                  </div>
                  <span className="text-[11px] text-sky-800 font-bold bg-sky-100 px-2.5 py-0.5 rounded-full">
                    Select from 139 Products
                  </span>
                </div>

                {/* Product Add Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6">
                    <label className="block font-bold text-slate-700 mb-1">
                      Choose Cracker Item
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => {
                        const pid = e.target.value;
                        setSelectedProductId(pid);
                        const prod = products.find(p => String(p.id) === String(pid));
                        if (prod?.unit) setSelectedUnit(prod.unit);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white text-xs"
                    >
                      <option value="">-- Select Cracker --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          #{p.sNo} {p.name} ({p.tamilName}) - MRP ₹{p.originalPrice}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Unit</label>
                    <input
                      type="text"
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      placeholder="1 BOX, 2 PKT"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddProductToCombo}
                      className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Added Items List */}
                {comboForm.items.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 text-xs italic">
                    No cracker items added to this combo yet. Use the dropdown above to add products.
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-sky-100 rounded-xl bg-white divide-y divide-slate-100">
                    {comboForm.items.map((it, idx) => {
                      const itemTotalMRP = (Number(it.originalPrice) || 0) * (Number(it.quantity) || 1);
                      return (
                        <div key={idx} className="p-2.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-slate-800">{it.name}</span>
                              {it.tamilName && <span className="text-slate-500 ml-1.5">({it.tamilName})</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                                className="w-12 px-1.5 py-0.5 rounded border border-slate-200 text-center font-bold text-xs"
                              />
                              <span className="text-[11px] text-slate-500 font-medium">{it.unit}</span>
                            </div>

                            <div className="text-right w-20">
                              <span className="font-bold text-slate-700">₹{itemTotalMRP.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-slate-400 block">(@ ₹{it.originalPrice})</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Remove item from combo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CRITICAL PRICING & CALCULATION DASHBOARD (USER REQUIREMENT) */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                  <Calculator className="w-5 h-5 text-amber-700" />
                  <h4 className="font-black text-slate-900 text-sm">
                    Automated MRP Calculation &amp; Revised Selling Price
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                  {/* Total Price for Added Products (Auto-calculated) */}
                  <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      1. Total Market MRP of Added Products
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        ₹{(comboForm.totalMarketPrice || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold line-through">
                        Standard MRP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Computed automatically by multiplying quantity × standard MRP of each added item.
                    </p>
                  </div>

                  {/* Revised Price by Owner */}
                  <div className="bg-white rounded-xl p-4 border-2 border-emerald-500 shadow-md">
                    <label className="block text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-1">
                      2. Owner Revised Offer Price (Customer Pays) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-emerald-700 text-sm">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={comboForm.offerPrice}
                        onChange={(e) => setComboForm(prev => ({ ...prev, offerPrice: Number(e.target.value) }))}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-emerald-300 text-2xl font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-800 font-bold mt-1">
                      ⚡ This revised price will immediately show on the user&apos;s /combo-offers page!
                    </p>
                  </div>
                </div>

                {/* Instant Calculation Preview */}
                {comboForm.totalMarketPrice > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black">
                        Instant Savings: ₹{Math.max(0, comboForm.totalMarketPrice - comboForm.offerPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-black">
                        Discount: {Math.max(0, Math.round(((comboForm.totalMarketPrice - comboForm.offerPrice) / comboForm.totalMarketPrice) * 100))}% OFF
                      </span>
                    </div>

                    <span className="text-slate-500 text-[11px]">
                      Items Count: <strong>{comboForm.items.length} fireworks</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black shadow-md flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Combo Offer...' : 'Save Combo Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
