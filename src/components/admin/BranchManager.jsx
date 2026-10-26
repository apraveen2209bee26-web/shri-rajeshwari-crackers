'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  ExternalLink, 
  Save, 
  X, 
  CheckCircle, 
  Building2, 
  Compass, 
  Loader2 
} from 'lucide-react';

export default function BranchManager({ onNotification = () => {} }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingBranch, setEditingBranch] = useState(null);
  const [saving, setSaving] = useState(false);

  const [branchForm, setBranchForm] = useState({
    name: '',
    tamilName: '',
    address: '',
    city: 'Sivakasi',
    pincode: '626123',
    phone: '9159802698',
    secondaryPhone: '6369732737',
    googleMapsUrl: '',
    isMainBranch: false
  });

  const loadBranches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      if (data.success && data.branches) {
        setBranches(data.branches);
      }
    } catch (err) {
      console.error('Failed to load branches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingBranch(null);
    setBranchForm({
      name: '',
      tamilName: '',
      address: '',
      city: 'Sivakasi',
      pincode: '626123',
      phone: '9159802698',
      secondaryPhone: '6369732737',
      googleMapsUrl: '',
      isMainBranch: branches.length === 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (branch) => {
    setModalMode('edit');
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name || '',
      tamilName: branch.tamilName || '',
      address: branch.address || '',
      city: branch.city || 'Sivakasi',
      pincode: branch.pincode || '626123',
      phone: branch.phone || '',
      secondaryPhone: branch.secondaryPhone || '',
      googleMapsUrl: branch.googleMapsUrl || '',
      isMainBranch: Boolean(branch.isMainBranch)
    });
    setIsModalOpen(true);
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.name.trim() || !branchForm.address.trim()) {
      alert('Branch name and address are required.');
      return;
    }

    setSaving(true);
    try {
      const mapUrl = branchForm.googleMapsUrl.trim() || 
        `https://maps.google.com/?q=${encodeURIComponent(`${branchForm.name}, ${branchForm.address}, ${branchForm.city} ${branchForm.pincode}`)}`;

      const payload = {
        ...branchForm,
        googleMapsUrl: mapUrl
      };

      if (modalMode === 'create') {
        const res = await fetch('/api/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.branch) {
          setBranches(prev => [...prev, data.branch]);
          onNotification(`Branch "${data.branch.name}" successfully added!`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Failed to create branch');
        }
      } else {
        const res = await fetch(`/api/branches/${editingBranch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.branch) {
          setBranches(prev => prev.map(b => b.id === editingBranch.id ? data.branch : b));
          onNotification(`Branch "${data.branch.name}" updated!`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Failed to update branch');
        }
      }
    } catch (err) {
      console.error('Save branch error:', err);
      alert('Error saving branch location');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (!confirm(`Are you sure you want to delete branch "${branch.name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/branches/${branch.id}`, { method: 'DELETE' });
      if (res.ok) {
        setBranches(prev => prev.filter(b => b.id !== branch.id));
        onNotification(`Branch "${branch.name}" deleted.`);
      }
    } catch (e) {
      alert('Failed to delete branch');
    }
  };

  const generateAutoMapUrl = () => {
    if (!branchForm.address.trim()) {
      alert('Please enter an address first to generate Google Maps link.');
      return;
    }
    const query = encodeURIComponent(`${branchForm.name || 'Sri Rajeshwari Crackers'}, ${branchForm.address}, ${branchForm.city} ${branchForm.pincode}`);
    setBranchForm(prev => ({
      ...prev,
      googleMapsUrl: `https://maps.google.com/?q=${query}`
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Branch Locations &amp; Google Maps
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your shop location and additional branches. Each location automatically shows up on the About Us page with a direct one-tap navigation link to Google Maps!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/about"
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>View Public /about Page</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>

      {/* Branches List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-sm">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
          Loading branches...
        </div>
      ) : branches.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Branches Configured Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Add your main shop address and any extra branches or depots so customers can easily locate and navigate to you on Google Maps.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Branch</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className={`glass-card rounded-2xl p-5 border transition-all duration-200 space-y-4 flex flex-col justify-between ${
                branch.isMainBranch
                  ? 'border-sky-300 ring-2 ring-sky-500/20 bg-sky-50/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {branch.name}
                      </h3>
                      {branch.tamilName && (
                        <p className="text-xs text-slate-500 font-medium">
                          {branch.tamilName}
                        </p>
                      )}
                    </div>
                  </div>

                  {branch.isMainBranch && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-600 text-white shrink-0">
                      Main Showroom
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1.5">
                  <p className="font-medium text-slate-800">
                    {branch.address}, {branch.city} - {branch.pincode}
                  </p>
                  {(branch.phone || branch.secondaryPhone) && (
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      <span>{branch.phone} {branch.secondaryPhone ? `• ${branch.secondaryPhone}` : ''}</span>
                    </p>
                  )}
                </div>

                {branch.googleMapsUrl && (
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 font-bold underline hover:no-underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Test Google Maps Navigation Link</span>
                  </a>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(branch)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteBranch(branch)}
                  className="p-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all"
                  title="Delete Branch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT BRANCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-sky-100 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {modalMode === 'create' ? 'Add Store Location / Branch' : `Edit Branch: ${editingBranch?.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Displayed on About Us page with direct Google Maps route navigation.
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

            <form onSubmit={handleSaveBranch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Branch Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Sivakasi Head Showroom & Fireworks Depot"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  கிளை பெயர் (Tamil Name)
                </label>
                <input
                  type="text"
                  value={branchForm.tamilName}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, tamilName: e.target.value }))}
                  placeholder="e.g. சிவகாசி முதன்மை பட்டாசு விற்பனையகம்"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={branchForm.address}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. 124-A, Chair Pillaiyar Kovil Street, Near Old Bus Stand"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={branchForm.city}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={branchForm.pincode}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="9159802698"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secondary Phone</label>
                  <input
                    type="text"
                    value={branchForm.secondaryPhone}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                    placeholder="6369732737"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Google Maps Link (URL)
                  </label>
                  <button
                    type="button"
                    onClick={generateAutoMapUrl}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-bold underline"
                  >
                    Auto-create link from address
                  </button>
                </div>
                <input
                  type="url"
                  value={branchForm.googleMapsUrl}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Paste any Google Maps link or click &quot;Auto-create link from address&quot; above.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={branchForm.isMainBranch}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, isMainBranch: e.target.checked }))}
                    className="rounded text-sky-600 h-4 w-4"
                  />
                  <span className="font-bold text-slate-700">Set as Head Office / Main Branch</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
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
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Branch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
