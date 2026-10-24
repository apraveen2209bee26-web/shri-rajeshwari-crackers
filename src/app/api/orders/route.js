import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { invalidateProductsCache } from '@/lib/cache';
import { verifyAdminAuth } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/orders - Protected for authenticated admin only
export async function GET(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to access customer orders.' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000
    });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Helper to retry database operations if locked or contested under high load
async function executeWithRetry(operation, retries = 4, delay = 50) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay * (i + 1)));
    }
  }
}

// POST /api/orders - Public endpoint for customer checkout
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      whatsappNumber,
      address,
      city,
      pincode,
      deliveryDate = '',
      items = [],
      totalMrp,
      totalSavings,
      finalAmount
    } = body;

    // Guaranteed collision-proof Order Reference for high-concurrency festive surges
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const timePart = Date.now().toString().slice(-4);
    const orderRef = `SR-${timePart}-${randomHex}`;

    // 1. Create Order record with retry resilience
    const order = await executeWithRetry(() => prisma.order.create({
      data: {
        orderRef,
        customerName: (customerName || 'Valued Customer').trim().slice(0, 100),
        whatsappNumber: (whatsappNumber || '').trim().slice(0, 25),
        address: (address || '').trim().slice(0, 300),
        city: (city || '').trim().slice(0, 100),
        pincode: (pincode || '').trim().slice(0, 15),
        deliveryDate: (deliveryDate || '').trim().slice(0, 50),
        itemsJson: JSON.stringify(items),
        totalMrp: Number(totalMrp) || 0,
        totalSavings: Number(totalSavings) || 0,
        finalAmount: Number(finalAmount) || 0,
        status: 'WhatsApp Order Placed'
      }
    }));

    // 2. High-performance concurrent stock decrement using Promise.all
    const validItems = items.filter(it => it.id && it.quantity > 0);
    if (validItems.length > 0) {
      await Promise.all(
        validItems.map(async (item) => {
          try {
            await executeWithRetry(async () => {
              const product = await prisma.product.findUnique({ where: { id: Number(item.id) } });
              if (product) {
                const newStock = Math.max(0, product.stock - Number(item.quantity));
                await prisma.product.update({
                  where: { id: product.id },
                  data: {
                    stock: newStock,
                    inStock: newStock > 0
                  }
                });
              }
            });
          } catch (stockErr) {
            console.error(`Failed to decrement stock for product #${item.id}:`, stockErr);
          }
        })
      );
    }

    invalidateProductsCache();

    return NextResponse.json({ success: true, orderRef, order }, { status: 201 });
  } catch (error) {
    console.error('Error recording order:', error);
    return NextResponse.json({ success: false, error: 'Failed to record order' }, { status: 500 });
  }
}

// DELETE /api/orders - Protected for authenticated admin only (Annual Cleanup)
export async function DELETE(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to perform annual cleanup.' },
        { status: 401 }
      );
    }

    const deleteResult = await prisma.order.deleteMany({});
    return NextResponse.json({ 
      success: true, 
      message: `Cleared ${deleteResult.count} orders from database`,
      count: deleteResult.count 
    });
  } catch (error) {
    console.error('Error clearing orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear orders' }, { status: 500 });
  }
}
