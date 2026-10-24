'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle, 
  LogOut, 
  Package, 
  ShoppingCart, 
  Flame, 
  X, 
  Save, 
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Loader2,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Settings,
  Phone,
  Database,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { STORE_CONFIG, SUB_CATEGORIES } from '@/lib/constants';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'settings'

  // Products State
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // 'All' | 'in' | 'out'

  // Orders State & Search / Pagination
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 10;

  // Filter orders by Order Reference (#SR-...), Mobile Number, Customer Name, or City
  const filteredOrders = React.useMemo(() => {
    if (!orderSearch.trim()) return orders;
    const q = orderSearch.toLowerCase().trim();
    const qDigits = q.replace(/[^0-9]/g, '');
    return orders.filter(ord => {
      const matchRef = (ord.orderRef || '').toLowerCase().includes(q);
      const matchPhone = qDigits.length > 0 && (ord.whatsappNumber || '').replace(/[^0-9]/g, '').includes(qDigits);
      const matchName = (ord.customerName || '').toLowerCase().includes(q);
      const matchCity = (ord.city || '').toLowerCase().includes(q);
      const matchAddress = (ord.address || '').toLowerCase().includes(q);
      return matchRef || matchPhone || matchName || matchCity || matchAddress;
    });
  }, [orders, orderSearch]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = React.useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage, ordersPerPage]);

  React.useEffect(() => {
    setOrderPage(1);
  }, [orderSearch]);


  // Dynamic Store & WhatsApp Settings State
  const [settings, setSettings] = useState({
    shop_name: STORE_CONFIG.name,
    whatsapp_number: STORE_CONFIG.whatsappNumber,
    secondary_phone: STORE_CONFIG.secondaryPhone,
    address: STORE_CONFIG.address
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    tamilName: '',
    category: 'One Sound',
    macroCategory: 'Daylight',
    unit: '1 Box',
    originalPrice: 100,
    price: 20,
    stock: 100,
    inStock: true,
    image: '/images/illustration-diwali-crackers.avif',
    description: '',
    featured: false
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState('');

  // Authentication check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check');
        const clientAuth = sessionStorage.getItem('sachin_admin_authenticated') || sessionStorage.getItem('admin_authenticated');
        if (res.ok || clientAuth === 'true') {
          setAuthorized(true);
        } else {
          router.push('/admin/login');
        }
      } catch (e) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?sort=sNo-asc');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          shop_name: data.settings.shop_name || STORE_CONFIG.name,
          whatsapp_number: data.settings.whatsapp_number || STORE_CONFIG.whatsappNumber,
          secondary_phone: data.settings.secondary_phone || STORE_CONFIG.secondaryPhone,
          address: data.settings.address || STORE_CONFIG.address
        });
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadProducts();
      loadOrders();
      loadSettings();
    }
  }, [authorized]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    sessionStorage.removeItem('sachin_admin_authenticated');
    sessionStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  // Toggle Stock Status
  const toggleStock = async (product) => {
    const newStatus = !product.inStock;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStatus })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newStatus } : p));
        showNotification(`Stock status updated for ${product.name}!`);
      }
    } catch (e) {
      alert('Failed to update stock status');
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== product.id));
        showNotification(`Product "${product.name}" deleted.`);
      }
    } catch (e) {
      alert('Failed to delete product');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    setModalForm({
      name: '',
      tamilName: '',
      category: 'One Sound',
      macroCategory: 'Daylight',
      unit: '1 Box',
      originalPrice: 100,
      price: 20,
      stock: 100,
      inStock: true,
      image: '/images/illustration-diwali-crackers.avif',
      description: '',
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setModalForm({
      name: product.name,
      tamilName: product.tamilName || '',
      category: product.category,
      macroCategory: product.macroCategory,
      unit: product.unit || '1 Box',
      originalPrice: product.originalPrice,
      price: product.price,
      stock: product.stock,
      inStock: product.inStock,
      image: product.image,
      description: product.description || '',
      featured: product.featured || false
    });
    setIsModalOpen(true);
  };

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
        setModalForm(prev => ({ ...prev, image: data.url }));
        showNotification('Photo uploaded successfully! Remember to click Save.');
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

  const handleModalSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...modalForm,
        originalPrice: Number(modalForm.originalPrice),
        price: Number(modalForm.price),
        stock: Number(modalForm.stock),
        inStock: Number(modalForm.stock) > 0 && Boolean(modalForm.inStock)
      };

      if (modalMode === 'create') {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.product) {
          setProducts(prev => [...prev, data.product]);
          showNotification(`New product "${data.product.name}" added to catalog!`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Failed to create product');
        }
      } else {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.product) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
          showNotification(`Product "${data.product.name}" successfully updated!`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Failed to update product');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  // Save Dynamic Store & WhatsApp Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`WhatsApp receiving number successfully updated to ${settings.whatsapp_number}! All new customer orders will now be routed here.`);
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Settings save error:', err);
      alert('Error updating settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Export Orders to CSV
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = [
      'Order Reference',
      'Date & Time',
      'Customer Name',
      'WhatsApp Number',
      'City',
      'Pincode',
      'Delivery Address',
      'Preferred Date',
      'Items Count',
      'Items Breakdown',
      'Total MRP (INR)',
      'Total Savings (INR)',
      'Final Payable Amount (INR)',
      'Status'
    ];

    // Helper to prevent CSV Formula Injection in Excel/Google Sheets
    const sanitizeCsvCell = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      // If cell begins with formula characters (=, +, -, @), prefix with a single quote
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = orders.map(ord => {
      let itemsList = [];
      try {
        itemsList = JSON.parse(ord.itemsJson);
      } catch (e) {}

      const itemsSummary = itemsList
        .map(i => `${i.name} (${i.quantity}x)`)
        .join('; ');

      return [
        sanitizeCsvCell(ord.orderRef),
        sanitizeCsvCell(new Date(ord.createdAt).toLocaleString('en-IN')),
        sanitizeCsvCell(ord.customerName || ''),
        sanitizeCsvCell(ord.whatsappNumber || ''),
        sanitizeCsvCell(ord.city || ''),
        sanitizeCsvCell(ord.pincode || ''),
        sanitizeCsvCell(ord.address || ''),
        sanitizeCsvCell(ord.deliveryDate || ''),
        itemsList.length,
        sanitizeCsvCell(itemsSummary),
        ord.totalMrp || 0,
        ord.totalSavings || 0,
        ord.finalAmount || 0,
        sanitizeCsvCell(ord.status || 'Order Placed')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shri_rajeshwari_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('CSV order backup downloaded successfully!');
  };

  // Clear / Purge All Orders (Annual Cleanup to stay 100% Free Forever)
  const handleClearAllOrders = async () => {
    if (!orders || orders.length === 0) {
      alert('There are no orders to clear.');
      return;
    }
    const confirmBackup = confirm(
      `⚠️ ANNUAL DATABASE CLEANUP:\n\nYou are about to permanently delete all ${orders.length} orders from the database to keep your store 100% free.\n\nHave you already clicked "Download CSV File" to save your backup?\n\nClick OK to permanently clear the orders list.`
    );
    if (!confirmBackup) return;

    try {
      const res = await fetch('/api/orders', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders([]);
        showNotification(`Database cleanup successful! Cleared ${data.count} orders. Your database is now 100% lean and fast.`);
      } else {
        alert(data.error || 'Failed to clear orders');
      }
    } catch (e) {
      alert('Error clearing orders from database');
    }
  };


  const filteredProducts = products.filter(p => {
    const matchSearch = search.trim() === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(search.trim())) ||
      p.sNo.toString() === search.trim();
    
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStock = stockFilter === 'All' || 
      (stockFilter === 'in' && p.inStock && p.stock > 0) || 
      (stockFilter === 'out' && (!p.inStock || p.stock <= 0));

    return matchSearch && matchCategory && matchStock;
  });

  const inStockCount = products.filter(p => p.inStock && p.stock > 0).length;
  const outOfStockCount = products.filter(p => !p.inStock || p.stock <= 0).length;

  if (loading && !authorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm">Verifying administrative access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-2 shrink-0 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Shri Rajeshwari Crackers"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>AUTHENTICATED ADMINISTRATIVE CONSOLE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              {settings.shop_name || STORE_CONFIG.name} Control Center
            </h1>
            <p className="text-xs text-sky-200">
              {STORE_CONFIG.tamilName} • {settings.address || STORE_CONFIG.address}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick WhatsApp Configuration Badge */}
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
            title="Click to configure WhatsApp receiver number"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Orders WA: <strong>+91 {settings.whatsapp_number}</strong></span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-xs flex items-center gap-2 animate-fadeIn shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 INTERACTIVE METRIC TILES (Matches User Specification Exactly) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. TOTAL CATALOG */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('products');
            setStockFilter('All');
          }}
          className={`text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
            activeTab === 'products' && stockFilter === 'All'
              ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-400 shadow-md'
              : 'glass-panel border-sky-100 hover:border-sky-300 hover:shadow-md'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            TOTAL CATALOG
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {products.length}
          </p>
          <span className="text-[10px] text-sky-600 font-medium block mt-0.5">
            Active in Database
          </span>
        </button>

        {/* 2. IN STOCK */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('products');
            setStockFilter('in');
          }}
          className={`text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
            activeTab === 'products' && stockFilter === 'in'
              ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500 shadow-md'
              : 'glass-panel border-emerald-100 hover:border-emerald-300 hover:shadow-md'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            IN STOCK
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {inStockCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            Available to customers
          </span>
        </button>

        {/* 3. OUT OF STOCK */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('products');
            setStockFilter('out');
          }}
          className={`text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
            activeTab === 'products' && stockFilter === 'out'
              ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500 shadow-md'
              : 'glass-panel border-rose-100 hover:border-rose-300 hover:shadow-md'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
            OUT OF STOCK
          </span>
          <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">
            {outOfStockCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            Disabled on storefront
          </span>
        </button>

        {/* 4. WHATSAPP ORDERS */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('orders');
          }}
          className={`text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
            activeTab === 'orders'
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500 shadow-md'
              : 'glass-panel border-amber-100 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            WHATSAPP ORDERS
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
            {orders.length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            Captured submissions
          </span>
        </button>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory CRUD ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Customer WhatsApp Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>WhatsApp Routing & Store Settings</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT INVENTORY CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-4 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search S.No, Name, தமிழ்..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium"
              >
                <option value="All">All Categories</option>
                {SUB_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium"
              >
                <option value="All">All Stock ({products.length})</option>
                <option value="in">In Stock Only ({inStockCount})</option>
                <option value="out">Out of Stock Only ({outOfStockCount})</option>
              </select>

              {(search || categoryFilter !== 'All' || stockFilter !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setCategoryFilter('All'); setStockFilter('All'); }}
                  className="text-xs text-sky-600 hover:text-sky-800 font-semibold px-2 py-1"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <button
              onClick={openCreateModal}
              className="w-full md:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Cracker</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-sky-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-slate-700 font-bold border-b border-sky-100">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                    <th className="py-2.5 px-3 w-14">Image</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Tamil Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Timing</th>
                    <th className="py-2.5 px-3 text-right">MRP</th>
                    <th className="py-2.5 px-3 text-right font-black text-sky-950">Net Price & Stock</th>
                    <th className="py-2.5 px-3 text-center">Discount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const discountPct = product.originalPrice > 0 
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;
                    const savings = Math.max(0, Math.round(product.originalPrice - product.price));

                    return (
                      <tr key={product.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                          {product.sNo}
                        </td>
                        <td className="py-2 px-3">
                          <img
                            src={product.image || '/images/illustration-diwali-crackers.avif'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                            onError={(e) => { e.target.src = '/images/illustration-diwali-crackers.avif'; }}
                          />
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {product.name}
                          {product.featured && (
                            <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-tamil">
                          {product.tamilName || '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-medium">
                          {product.category}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            product.macroCategory === 'Daylight'
                              ? 'bg-amber-100 text-amber-800'
                              : product.macroCategory === 'Nightlight'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}>
                            {product.macroCategory}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400 line-through">
                          ₹{product.originalPrice}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-black text-sky-900 text-sm block">₹{product.price}</span>
                          <span className={`text-[10px] font-bold block ${product.stock > 0 && product.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {product.stock} units in stock
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                              {discountPct}% OFF
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 mt-0.5">
                              Save ₹{savings}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => toggleStock(product)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              product.inStock && product.stock > 0
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title="Click to toggle stock"
                          >
                            {product.inStock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-1 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors"
                              title="Edit Product & Stock"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete Product"
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
          </div>
        </div>
      )}

      {/* TAB 2: WHATSAPP ORDERS WITH CSV EXPORT, SEARCH, PAGINATION & CLOUD STORAGE ADVISORY */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* DATABASE STORAGE CAPACITY ADVISORY BANNER (Updated to reflect Cloud PostgreSQL Neon AWS) */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-950 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-amber-950 text-sm">
                  ⚡ Cloud PostgreSQL Database Storage (Neon AWS) & Regular Backup Reminder
                </p>
                <p className="text-amber-900 leading-relaxed max-w-2xl">
                  Your store is connected live to a high-speed Cloud PostgreSQL database on AWS. To keep your database query speeds lightning-fast and ensure you stay within your <strong>100% Free Forever Tier</strong> without consuming quota, it is strongly recommended to periodically <strong>Download CSV Backup</strong> and use <strong>Annual Cleanup</strong> at the end of each festive season.
                </p>
                <p className="text-[11px] text-amber-800 font-semibold pt-1">
                  Current Cloud Database Submissions: <strong>{orders.length} orders saved</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={orders.length === 0}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export Orders (CSV)</span>
            </button>
          </div>

          {/* Orders Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-sky-600" />
              <span>WhatsApp Direct Customer Orders ({orders.length})</span>
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                disabled={orders.length === 0}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:bg-slate-300 flex-1 sm:flex-none"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download CSV Backup</span>
              </button>
              <button
                onClick={handleClearAllOrders}
                disabled={orders.length === 0}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
                title="Purge all orders after downloading backup to keep database 100% free"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Annual Cleanup</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar for Orders */}
          <div className="glass-panel rounded-2xl p-4 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Mobile (e.g. 916369...), Order Ref #SR-, Name, City..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
              {orderSearch && (
                <button
                  onClick={() => setOrderSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs text-slate-600 font-medium">
              <span>
                Showing <strong className="text-slate-900 font-bold">{filteredOrders.length}</strong> of {orders.length} orders
              </span>
              {orderSearch && (
                <button
                  onClick={() => setOrderSearch('')}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Orders Content List */}
          {ordersLoading ? (
            <p className="text-xs text-slate-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-xs">
              No WhatsApp orders placed yet. As customers checkout from the cart, their orders will appear here automatically with real-time stock decrements!
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center text-slate-500 text-xs space-y-2">
              <p>No orders found matching &ldquo;<strong>{orderSearch}</strong>&rdquo;.</p>
              <button
                onClick={() => setOrderSearch('')}
                className="px-3 py-1 rounded-lg bg-sky-600 text-white font-bold text-xs"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedOrders.map((ord) => {
                let itemsList = [];
                try {
                  itemsList = JSON.parse(ord.itemsJson);
                } catch (e) {}

                return (
                  <div key={ord.id} className="glass-card rounded-2xl p-5 border border-sky-100 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                      <div>
                        <span className="font-mono font-bold text-sky-800 text-sm">#{ord.orderRef}</span>
                        <span className="text-[11px] text-slate-400 ml-2">
                          {new Date(ord.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {ord.status}
                        </span>
                        <strong className="text-base font-black text-sky-950">
                          ₹{ord.finalAmount.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500 font-medium">Customer Details:</p>
                        <p className="font-bold text-slate-800">{ord.customerName}</p>
                        <p className="text-slate-600">
                          WhatsApp:{' '}
                          <a 
                            href={`https://wa.me/91${ord.whatsappNumber}`} 
                            target="_blank" 
                            className="text-green-600 font-bold underline"
                          >
                            +91 {ord.whatsappNumber}
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Delivery Destination:</p>
                        <p className="text-slate-800">{ord.address}, {ord.city} - {ord.pincode}</p>
                        {ord.deliveryDate && <p className="text-sky-700 font-semibold">Preferred Delivery: {ord.deliveryDate}</p>}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <p className="text-slate-500 font-semibold mb-1">Ordered Items ({itemsList.length}):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {itemsList.map((it, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                            {it.name} × {it.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls (10 orders per page) */}
          {filteredOrders.length > ordersPerPage && (
            <div className="glass-panel rounded-2xl p-4 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <p className="text-xs text-slate-600 font-medium">
                Showing <strong className="text-slate-900 font-bold">{(orderPage - 1) * ordersPerPage + 1}</strong> to <strong className="text-slate-900 font-bold">{Math.min(orderPage * ordersPerPage, filteredOrders.length)}</strong> of <strong className="text-slate-900 font-bold">{filteredOrders.length}</strong> orders (Page {orderPage} of {totalOrderPages})
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setOrderPage(prev => Math.max(1, prev - 1))}
                  disabled={orderPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalOrderPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalOrderPages || Math.abs(p - orderPage) <= 1)
                  .map((p, idx, arr) => {
                    const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsisBefore && <span className="px-1 text-slate-400 text-xs">...</span>}
                        <button
                          onClick={() => setOrderPage(p)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            orderPage === p
                              ? 'bg-sky-600 text-white shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  onClick={() => setOrderPage(prev => Math.min(totalOrderPages, prev + 1))}
                  disabled={orderPage === totalOrderPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DYNAMIC WHATSAPP ROUTING & STORE CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Dynamic WhatsApp Orders Routing
                </h3>
                <p className="text-xs text-slate-500">
                  Configure the destination phone number where all customer cart orders will be sent.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              {/* WhatsApp Number Input */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-xs">
                  Receiving WhatsApp Number (10 Digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-xs">+91</span>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="9159802698"
                    className="w-full pl-12 pr-4 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Example: If you change this from <strong>{STORE_CONFIG.whatsappNumber}</strong> to any new number, all subsequent user checkouts will automatically redirect directly to that new number on WhatsApp!
                </p>
              </div>

              {/* Secondary Call Number */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-xs">
                  Secondary Calling / 24/7 Telephone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-xs">+91</span>
                  <input
                    type="text"
                    value={settings.secondary_phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, secondary_phone: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="6369732737"
                    className="w-full pl-12 pr-4 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>

              {/* Store Display Name */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-xs">
                  Store Display Name
                </label>
                <input
                  type="text"
                  value={settings.shop_name}
                  onChange={(e) => setSettings(prev => ({ ...prev, shop_name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              {/* Physical Address */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-xs">
                  Physical Store Address (Sivakasi)
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={`https://wa.me/91${settings.whatsapp_number}?text=Hello%20from%20Shri%20Rajeshwari%20Crackers%20Admin%20Test`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-700 hover:underline font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Connection (+91 {settings.whatsapp_number})</span>
                </a>

                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-300"
                >
                  <Save className="w-4 h-4" />
                  <span>{settingsSaving ? 'Saving Settings...' : 'Save WhatsApp Configuration'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-sky-100 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                {modalMode === 'create' ? 'Add New Cracker to Catalog' : `Edit Product: ${editingProduct?.name}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">பட்டாசின் பெயர் (Tamil)</label>
                  <input
                    type="text"
                    value={modalForm.tamilName}
                    onChange={(e) => setModalForm(prev => ({ ...prev, tamilName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategory *</label>
                  <select
                    value={modalForm.category}
                    onChange={(e) => setModalForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    {SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Celebration Timing *</label>
                  <select
                    value={modalForm.macroCategory}
                    onChange={(e) => setModalForm(prev => ({ ...prev, macroCategory: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Daylight">Daylight</option>
                    <option value="Nightlight">Nightlight</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Per</label>
                  <input
                    type="text"
                    value={modalForm.unit}
                    onChange={(e) => setModalForm(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="1 Box, 1 Pkt"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (MRP) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    value={modalForm.originalPrice}
                    onChange={(e) => {
                      const orig = Number(e.target.value);
                      const net = Math.round(orig * 0.2);
                      setModalForm(prev => ({ ...prev, originalPrice: orig, price: net }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Net Price (80% Off) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    value={modalForm.price}
                    onChange={(e) => setModalForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Stock Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={modalForm.stock}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      setModalForm(prev => ({ 
                        ...prev, 
                        stock: s,
                        inStock: s > 0
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Photo</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {modalForm.image ? (
                      <img 
                        src={modalForm.image} 
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
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo from Device</span>
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
                      <span className="text-[11px] text-slate-400">or enter image path / URL below</span>
                    </div>

                    <input
                      type="text"
                      value={modalForm.image}
                      onChange={(e) => setModalForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="/images/... or /uploads/... or https://..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalForm.inStock}
                    onChange={(e) => setModalForm(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded text-sky-600 h-4 w-4"
                  />
                  <span className="font-bold text-slate-700">In Stock Status</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalForm.featured}
                    onChange={(e) => setModalForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded text-sky-600 h-4 w-4"
                  />
                  <span className="font-bold text-slate-700">Feature on Home Page</span>
                </label>
              </div>

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
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
