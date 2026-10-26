import prisma from '@/lib/prisma';

// Helper to sanitize fields against CSV injection attacks in Excel/Sheets
export function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

// Convert orders array into standard CSV format string
export function ordersToCsv(orders, isArchive = false) {
  const headers = [
    'Order Reference',
    'Order Date',
    ...(isArchive ? ['Deleted At'] : []),
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

  const rows = orders.map(ord => {
    let itemsList = [];
    try {
      itemsList = typeof ord.itemsJson === 'string' ? JSON.parse(ord.itemsJson) : (ord.itemsJson || []);
    } catch (e) {
      itemsList = [];
    }

    const itemsSummary = itemsList
      .map(i => `${i.name} (${i.quantity}x)`)
      .join('; ');

    const row = [
      sanitizeCsvCell(ord.orderRef),
      sanitizeCsvCell(new Date(ord.createdAt).toLocaleString('en-IN')),
      ...(isArchive ? [sanitizeCsvCell(ord.deletedAt ? new Date(ord.deletedAt).toLocaleString('en-IN') : 'Manual Delete')] : []),
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
    ];

    return row.join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

const ARCHIVE_KEY = 'deleted_orders_archive';

// Retrieve all archived deleted orders from AdminSetting
export async function getArchivedOrders() {
  try {
    const setting = await prisma.adminSetting.findUnique({
      where: { key: ARCHIVE_KEY }
    });
    if (!setting || !setting.value) return [];
    const list = JSON.parse(setting.value);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('Error fetching archived orders:', error);
    return [];
  }
}

// Archive one or more orders into AdminSetting
export async function archiveOrders(ordersToArchive) {
  if (!ordersToArchive || ordersToArchive.length === 0) return [];
  try {
    const current = await getArchivedOrders();
    const currentMap = new Map(current.map(o => [o.orderRef, o]));
    const now = new Date().toISOString();

    for (const ord of ordersToArchive) {
      currentMap.set(ord.orderRef, {
        ...ord,
        deletedAt: now
      });
    }

    const updated = Array.from(currentMap.values());

    await prisma.adminSetting.upsert({
      where: { key: ARCHIVE_KEY },
      update: { value: JSON.stringify(updated) },
      create: {
        key: ARCHIVE_KEY,
        value: JSON.stringify(updated)
      }
    });

    return updated;
  } catch (error) {
    console.error('Error archiving orders:', error);
    throw error;
  }
}

// Query PostgreSQL database size from Neon AWS
export async function getDatabaseStorageStats() {
  const TOTAL_QUOTA_BYTES = 512 * 1024 * 1024; // Neon AWS Free Forever Tier = 512 MB
  try {
    const result = await prisma.$queryRawUnsafe('SELECT pg_database_size(current_database()) as size_bytes;');
    const sizeBytes = Number(result[0]?.size_bytes || 0);
    const usedMb = Number((sizeBytes / (1024 * 1024)).toFixed(2));
    const totalQuotaMb = 512;
    const freeMb = Number(Math.max(0, totalQuotaMb - usedMb).toFixed(2));
    const percentUsed = Number(((usedMb / totalQuotaMb) * 100).toFixed(2));

    const activeOrdersCount = await prisma.order.count();
    const archivedList = await getArchivedOrders();

    return {
      usedBytes: sizeBytes,
      usedMb,
      totalQuotaMb,
      freeMb,
      percentUsed,
      activeOrdersCount,
      archivedOrdersCount: archivedList.length
    };
  } catch (error) {
    console.error('Error calculating database storage stats:', error);
    return {
      usedBytes: 8 * 1024 * 1024,
      usedMb: 8.0,
      totalQuotaMb: 512,
      freeMb: 504.0,
      percentUsed: 1.56,
      activeOrdersCount: 0,
      archivedOrdersCount: 0,
      error: error.message
    };
  }
}
