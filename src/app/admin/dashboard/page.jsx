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
  ChevronRight,
  Sparkles,
  MapPin,
  Building2,
  ChevronDown,
  Clock,
  Truck,
  Archive,
  CheckSquare,
  HardDrive,
  Calendar
} from 'lucide-react';
import { STORE_CONFIG, SUB_CATEGORIES } from '@/lib/constants';
import ComboManager from '@/components/admin/ComboManager';
import BranchManager from '@/components/admin/BranchManager';
import CalendarManager from '@/components/admin/CalendarManager';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'combos' | 'orders' | 'branches' | 'settings'

  // Products State
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // 'All' | 'in' | 'out'

  // Orders State & Search / Pagination
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All'); // 'All' | 'In Progress' | 'Packed' | 'Delivered' | 'WhatsApp Order Placed'
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 10;

  // Task Status counts for instant badges
  const orderCountsByStatus = React.useMemo(() => {
    const counts = {
      'All': orders.length,
      'In Progress': 0,
      'Packed': 0,
      'Delivered': 0,
      'WhatsApp Order Placed': 0
    };
    orders.forEach(ord => {
      const st = ord.status || 'WhatsApp Order Placed';
      if (counts[st] !== undefined) {
        counts[st]++;
      } else {
        counts['WhatsApp Order Placed']++;
      }
    });
    return counts;
  }, [orders]);

  // Dynamic light color theme mapping for each order task status
  const getOrderStatusTheme = (status) => {
    switch (status) {
      case 'In Progress':
        return {
          tileClass: 'bg-amber-50/70 hover:bg-amber-50/90 border-amber-200/90 hover:border-amber-300 shadow-sm shadow-amber-500/5',
          refText: 'text-amber-900',
          accentText: 'text-amber-950',
          divider: 'border-amber-200/60',
          itemBadge: 'bg-amber-100/90 text-amber-900 border border-amber-200',
          selectClass: 'bg-amber-100 text-amber-900 border-amber-300 focus:ring-amber-400'
        };
      case 'Packed':
        return {
          tileClass: 'bg-indigo-50/70 hover:bg-indigo-50/90 border-indigo-200/90 hover:border-indigo-300 shadow-sm shadow-indigo-500/5',
          refText: 'text-indigo-900',
          accentText: 'text-indigo-950',
          divider: 'border-indigo-200/60',
          itemBadge: 'bg-indigo-100/90 text-indigo-900 border border-indigo-200',
          selectClass: 'bg-indigo-100 text-indigo-900 border-indigo-300 focus:ring-indigo-400'
        };
      case 'Delivered':
        return {
          tileClass: 'bg-emerald-50/70 hover:bg-emerald-50/90 border-emerald-200/90 hover:border-emerald-300 shadow-sm shadow-emerald-500/5',
          refText: 'text-emerald-900',
          accentText: 'text-emerald-950',
          divider: 'border-emerald-200/60',
          itemBadge: 'bg-emerald-100/90 text-emerald-900 border border-emerald-200',
          selectClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 focus:ring-emerald-400'
        };
      case 'WhatsApp Order Placed':
      case 'Order Placed':
      default:
        return {
          tileClass: 'bg-white hover:bg-slate-50/70 border-slate-200/90 hover:border-sky-300 shadow-sm shadow-slate-900/5',
          refText: 'text-sky-800',
          accentText: 'text-slate-950',
          divider: 'border-slate-100',
          itemBadge: 'bg-slate-100/90 text-slate-700 border border-slate-200',
          selectClass: 'bg-slate-50 text-slate-800 border-slate-300 focus:ring-sky-400'
        };
    }
  };

  // Filter orders by Order Reference (#SR-...), Mobile Number, Customer Name, City, or Task Status
  const filteredOrders = React.useMemo(() => {
    let list = orders;

    // Filter by task status
    if (orderStatusFilter !== 'All') {
      list = list.filter(ord => (ord.status || 'WhatsApp Order Placed') === orderStatusFilter);
    }

    // Filter by search query
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const qDigits = q.replace(/[^0-9]/g, '');
      list = list.filter(ord => {
        const matchRef = (ord.orderRef || '').toLowerCase().includes(q);
        const matchPhone = qDigits.length > 0 && (ord.whatsappNumber || '').replace(/[^0-9]/g, '').includes(qDigits);
        const matchName = (ord.customerName || '').toLowerCase().includes(q);
        const matchCity = (ord.city || '').toLowerCase().includes(q);
        const matchAddress = (ord.address || '').toLowerCase().includes(q);
        return matchRef || matchPhone || matchName || matchCity || matchAddress;
      });
    }

    return list;
  }, [orders, orderSearch, orderStatusFilter]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = React.useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage, ordersPerPage]);

  React.useEffect(() => {
    setOrderPage(1);
  }, [orderSearch, orderStatusFilter]);

  // Database Storage Capacity & Stats
  const [dbStats, setDbStats] = useState({
    usedBytes: 8060928,
    usedMb: 7.69,
    totalQuotaMb: 512,
    freeMb: 504.31,
    percentUsed: 1.5,
    archivedOrdersCount: 0,
    loading: false
  });
  const [cleanupDropdownOpen, setCleanupDropdownOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);



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

  const loadDbStats = async () => {
    try {
      setDbStats(prev => ({ ...prev, loading: true }));
      const res = await fetch('/api/admin/db-stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setDbStats({
          usedBytes: data.stats.usedBytes || 8060928,
          usedMb: data.stats.usedMb,
          totalQuotaMb: data.stats.totalQuotaMb,
          freeMb: data.stats.freeMb,
          percentUsed: data.stats.percentUsed,
          archivedOrdersCount: data.stats.archivedOrdersCount,
          loading: false
        });
      }
    } catch (err) {
      console.error('Failed to load DB stats', err);
    } finally {
      setDbStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (authorized) {
      loadProducts();
      loadOrders();
      loadSettings();
      loadDbStats();
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

  // Cleanup Handler with Monthly, Annual, and Complete options (Auto-archives to CSV first)
  const handleCleanup = async (cleanupType = 'all') => {
    setCleanupDropdownOpen(false);
    if (!orders || orders.length === 0) {
      alert('There are no active orders to clean up.');
      return;
    }

    let confirmMsg = '';
    if (cleanupType === 'monthly') {
      confirmMsg = `🗓️ MONTHLY DATABASE CLEANUP:\n\nPurge orders older than 30 days from the active database table?\n\n✅ ALL purged orders are automatically backed up & permanently preserved in your CSV Archive.\n\nClick OK to proceed with monthly cleanup.`;
    } else if (cleanupType === 'annual') {
      confirmMsg = `🎆 ANNUAL FESTIVE DATABASE CLEANUP:\n\nPurge orders older than 1 year (365 days) from the active database table?\n\n✅ ALL purged orders are automatically backed up & permanently preserved in your CSV Archive.\n\nClick OK to proceed with annual cleanup.`;
    } else {
      confirmMsg = `⚠️ COMPLETE DATABASE PURGE:\n\nYou are about to clear all ${orders.length} active orders from the database.\n\n✅ ALL orders are automatically backed up & permanently preserved in your CSV Archive.\n\nClick OK to reset the active orders table.`;
    }

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/orders?type=${cleanupType}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadOrders();
        await loadDbStats();
        showNotification(data.message || `Cleanup complete! Database is now fast and lean.`);
      } else {
        alert(data.error || 'Failed to perform database cleanup');
      }
    } catch (e) {
      console.error('Error during database cleanup:', e);
      alert('Error during cleanup process');
    }
  };

  // Delete Individual Order (Persisted to CSV Archive)
  const handleDeleteSingleOrder = async (order) => {
    const confirmDelete = confirm(
      `🗑️ DELETE ORDER #${order.orderRef}?\n\nCustomer: ${order.customerName}\nAmount: ₹${order.finalAmount}\n\n✅ This order will be removed from the active orders list and safely preserved in your downloadable CSV Archive.\n\nClick OK to delete.`
    );
    if (!confirmDelete) return;

    setDeletingOrderId(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== order.id));
        await loadDbStats();
        showNotification(`Order #${order.orderRef} deleted and preserved in CSV archive!`);
      } else {
        alert(data.error || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Error deleting order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Update Order Status (In Progress, Packed, Delivered, WhatsApp Order Placed)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showNotification(`Order status updated to "${newStatus}"!`);
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Download Persistent Deleted Orders Archive as CSV
  const handleDownloadArchiveCSV = () => {
    const link = document.createElement('a');
    link.href = '/api/orders/archive?download=csv';
    link.setAttribute('download', `shri_rajeshwari_deleted_orders_archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Downloading deleted orders CSV archive...');
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
      <div className="flex border-b border-slate-200 gap-3 sm:gap-6 overflow-x-auto pb-1">
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
          onClick={() => setActiveTab('combos')}
          className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'combos'
              ? 'border-red-600 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="flex items-center gap-1.5">
            Combo Offers Configuration
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase">NEW</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('calendars')}
          className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'calendars'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Calendars Management</span>
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
          onClick={() => setActiveTab('branches')}
          className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'branches'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-600" />
          <span>Branches &amp; Google Maps</span>
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
          <span>WhatsApp Routing &amp; Profile</span>
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

      {/* TAB 2: COMBO OFFERS CONFIGURATION */}
      {activeTab === 'combos' && (
        <ComboManager products={products} onNotification={showNotification} />
      )}

      {/* TAB 3: WHATSAPP ORDERS WITH CSV EXPORT, SEARCH, PAGINATION & CLOUD STORAGE ADVISORY */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* DATABASE STORAGE CAPACITY ADVISORY BANNER (Live Cloud PostgreSQL Neon AWS Metrics) */}
          <div className="bg-amber-50/95 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 text-amber-950 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-700">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-black text-amber-950 text-base">
                      ⚡ Cloud PostgreSQL Database Storage (Neon AWS)
                    </h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      100% Free Forever Tier
                    </span>
                  </div>
                  <p className="text-amber-900/90 text-xs leading-relaxed max-w-3xl">
                    Your store is connected live to a high-speed Serverless PostgreSQL database on AWS. To keep query speeds lightning-fast and ensure you never pay hosting fees, you can periodically export CSV backups and run monthly or annual cleanups.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportCSV}
                  disabled={orders.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Active (CSV)</span>
                </button>

                <button
                  onClick={loadDbStats}
                  disabled={dbStats.loading}
                  title="Refresh live database space statistics from AWS Neon"
                  className="p-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/50 text-amber-800 transition-all active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${dbStats.loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Real-time Storage Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/90 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs">
                <p className="text-[11px] font-bold text-amber-800/80 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>Database Space Used</span>
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-amber-950 font-mono">{dbStats.usedMb} MB</span>
                  <span className="text-[11px] text-amber-700 font-semibold">used</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{(dbStats.usedBytes / 1024).toFixed(0)} KB in Neon AWS</p>
              </div>

              <div className="bg-white/90 border border-emerald-200/80 rounded-2xl p-3.5 shadow-xs">
                <p className="text-[11px] font-bold text-emerald-800/80 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Database Space Available</span>
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-emerald-700 font-mono">{dbStats.freeMb} MB</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">free</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Plenty of free headroom available</p>
              </div>

              <div className="bg-white/90 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs">
                <p className="text-[11px] font-bold text-amber-800/80 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-sky-600" />
                  <span>Free Tier Quota Limit</span>
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-slate-900 font-mono">{dbStats.totalQuotaMb} MB</span>
                  <span className="text-[11px] text-slate-500 font-semibold">total</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{dbStats.percentUsed}% consumed</p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5 bg-amber-100/60 p-3 rounded-2xl border border-amber-200/70">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                <span>Storage Quota Utilization: {dbStats.usedMb} MB / {dbStats.totalQuotaMb} MB</span>
                <span className="text-emerald-700 font-black">{dbStats.freeMb} MB Available ({((dbStats.freeMb / dbStats.totalQuotaMb) * 100).toFixed(1)}% Free)</span>
              </div>
              <div className="w-full bg-amber-200/80 h-3 rounded-full overflow-hidden shadow-inner p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(1.5, dbStats.percentUsed))}%` }}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-amber-900 pt-1 gap-1">
                <p>
                  Current Database Records: <strong>{orders.length} active orders saved</strong>
                </p>
                <p className="text-sky-900 font-semibold">
                  Archived in CSV: <strong>{dbStats.archivedOrdersCount} deleted orders safely preserved</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Orders Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-sky-600" />
              <span>WhatsApp Customer Orders ({orders.length})</span>
            </h3>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Active Orders CSV Download */}
              <button
                onClick={handleExportCSV}
                disabled={orders.length === 0}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:bg-slate-300"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download CSV Backup</span>
              </button>

              {/* Deleted Orders CSV Archive Download */}
              <button
                onClick={handleDownloadArchiveCSV}
                disabled={dbStats.archivedOrdersCount === 0}
                className="px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:bg-slate-300"
                title="Download persistent archive of all deleted orders in CSV"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive CSV ({dbStats.archivedOrdersCount})</span>
              </button>

              {/* Cleanup Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setCleanupDropdownOpen(prev => !prev)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cleanup Orders</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                </button>

                {cleanupDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1"
                    onMouseLeave={() => setCleanupDropdownOpen(false)}
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                      Select Cleanup Option
                    </div>

                    <button
                      onClick={() => handleCleanup('monthly')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-950 transition-colors flex items-start gap-2.5 group"
                    >
                      <Calendar className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-xs group-hover:text-amber-900">Monthly Cleanup</p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Purge orders older than 30 days. Auto-archives all to CSV first.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCleanup('annual')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 text-slate-800 hover:text-rose-950 transition-colors flex items-start gap-2.5 group"
                    >
                      <Sparkles className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-xs group-hover:text-rose-900">Annual Cleanup</p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Purge festive orders older than 365 days. Auto-archives to CSV.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCleanup('all')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 text-red-700 transition-colors flex items-start gap-2.5 border-t border-slate-100 group"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-red-700">Clear All Active Orders</p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Purge all orders from DB. Preserved in CSV Archive.
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Status Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOrderStatusFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderStatusFilter === 'All'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>🌟 All Orders</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                orderStatusFilter === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {orderCountsByStatus['All']}
              </span>
            </button>

            <button
              onClick={() => setOrderStatusFilter('In Progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderStatusFilter === 'In Progress'
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-amber-50/90 text-amber-900 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <span>⏳ In Progress</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                orderStatusFilter === 'In Progress' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-950'
              }`}>
                {orderCountsByStatus['In Progress']}
              </span>
            </button>

            <button
              onClick={() => setOrderStatusFilter('Packed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderStatusFilter === 'Packed'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                  : 'bg-indigo-50/90 text-indigo-900 hover:bg-indigo-100 border border-indigo-300'
              }`}
            >
              <span>📦 Packed</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                orderStatusFilter === 'Packed' ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-950'
              }`}>
                {orderCountsByStatus['Packed']}
              </span>
            </button>

            <button
              onClick={() => setOrderStatusFilter('Delivered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderStatusFilter === 'Delivered'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-emerald-50/90 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <span>🚚 Delivered</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                orderStatusFilter === 'Delivered' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-950'
              }`}>
                {orderCountsByStatus['Delivered']}
              </span>
            </button>

            <button
              onClick={() => setOrderStatusFilter('WhatsApp Order Placed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderStatusFilter === 'WhatsApp Order Placed'
                  ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <span>📲 Order Placed</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                orderStatusFilter === 'WhatsApp Order Placed' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                {orderCountsByStatus['WhatsApp Order Placed']}
              </span>
            </button>
          </div>

          {/* Search & Filter Bar for Orders */}
          <div className="glass-panel rounded-2xl p-4 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Mobile, Order Ref #SR-, Name..."
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

              {/* Status Quick Dropdown */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-700 w-full sm:w-auto"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="In Progress">⏳ In Progress ({orderCountsByStatus['In Progress']})</option>
                  <option value="Packed">📦 Packed ({orderCountsByStatus['Packed']})</option>
                  <option value="Delivered">🚚 Delivered ({orderCountsByStatus['Delivered']})</option>
                  <option value="WhatsApp Order Placed">📲 Order Placed ({orderCountsByStatus['WhatsApp Order Placed']})</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs text-slate-600 font-medium">
              <span>
                Showing <strong className="text-slate-900 font-bold">{filteredOrders.length}</strong> of {orders.length} orders
              </span>
              {(orderSearch || orderStatusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setOrderSearch('');
                    setOrderStatusFilter('All');
                  }}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold underline"
                >
                  Reset All Filters
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
              <p>
                No orders found matching {orderStatusFilter !== 'All' ? <span>status &ldquo;<strong>{orderStatusFilter}</strong>&rdquo;</span> : null}
                {orderSearch ? <span> search &ldquo;<strong>{orderSearch}</strong>&rdquo;</span> : null}.
              </p>
              <button
                onClick={() => {
                  setOrderSearch('');
                  setOrderStatusFilter('All');
                }}
                className="px-3 py-1 rounded-lg bg-sky-600 text-white font-bold text-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedOrders.map((ord) => {
                let itemsList = [];
                try {
                  itemsList = typeof ord.itemsJson === 'string' ? JSON.parse(ord.itemsJson) : (ord.itemsJson || []);
                } catch (e) {}

                const statusTheme = getOrderStatusTheme(ord.status);

                return (
                  <div 
                    key={ord.id} 
                    className={`rounded-2xl p-5 border-2 transition-all duration-300 ${statusTheme.tileClass} space-y-3 hover:shadow-lg`}
                  >
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b ${statusTheme.divider} gap-3`}>
                      <div>
                        <span className={`font-mono font-bold text-sm ${statusTheme.refText}`}>#{ord.orderRef}</span>
                        <span className="text-[11px] text-slate-400 ml-2">
                          {new Date(ord.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Status Selector & Amount */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="relative inline-flex items-center">
                          <select
                            value={ord.status || 'WhatsApp Order Placed'}
                            disabled={updatingOrderId === ord.id}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 shadow-xs ${statusTheme.selectClass}`}
                          >
                            <option value="WhatsApp Order Placed">📲 Order Placed</option>
                            <option value="In Progress">⏳ In Progress</option>
                            <option value="Packed">📦 Packed</option>
                            <option value="Delivered">🚚 Delivered</option>
                          </select>
                          {updatingOrderId === ord.id && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600 ml-1.5" />
                          )}
                        </div>

                        <strong className={`text-base font-black ${statusTheme.accentText}`}>
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
                            rel="noopener noreferrer"
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

                    <div className={`pt-2 border-t ${statusTheme.divider} text-xs`}>
                      <p className="text-slate-500 font-semibold mb-1">Ordered Items ({itemsList.length}):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {itemsList.map((it, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-[11px] font-semibold ${statusTheme.itemBadge}`}>
                            {it.name} × {it.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Order Action Bar: Quick Task Switching & Individual Delete */}
                    <div className={`flex flex-wrap items-center justify-between pt-2.5 border-t ${statusTheme.divider} gap-2`}>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold mr-1">Task Status:</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'In Progress')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                            ord.status === 'In Progress'
                              ? 'bg-amber-500 text-white shadow-xs ring-1 ring-amber-300'
                              : 'bg-white/80 hover:bg-amber-100 text-amber-900 border border-amber-200/80'
                          }`}
                        >
                          ⏳ In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Packed')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                            ord.status === 'Packed'
                              ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-300'
                              : 'bg-white/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80'
                          }`}
                        >
                          📦 Packed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-300'
                              : 'bg-white/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80'
                          }`}
                        >
                          🚚 Delivered
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSingleOrder(ord)}
                        disabled={deletingOrderId === ord.id}
                        className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95 disabled:opacity-40"
                        title="Delete order from database (safely preserved in downloadable CSV Archive)"
                      >
                        {deletingOrderId === ord.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Delete Order</span>
                      </button>
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

      {/* TAB 2: COMBO OFFERS CONFIGURATION */}
      {activeTab === 'combos' && (
        <ComboManager onNotification={showNotification} />
      )}

      {/* TAB 3: CALENDARS PRODUCTION & PRICING CONFIGURATION */}
      {activeTab === 'calendars' && (
        <CalendarManager onNotification={showNotification} />
      )}

      {/* TAB 4: BRANCH LOCATIONS & GOOGLE MAPS CONFIGURATION */}
      {activeTab === 'branches' && (
        <BranchManager onNotification={showNotification} />
      )}

      {/* TAB 5: DYNAMIC WHATSAPP ROUTING & STORE CONFIGURATION */}
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
