import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { getArchivedOrders, ordersToCsv } from '@/lib/order-archive';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/orders/archive - Retrieve or download deleted orders archive
export async function GET(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download');
    const archivedOrders = await getArchivedOrders();

    if (download === 'csv' || searchParams.get('format') === 'csv') {
      const csvString = ordersToCsv(archivedOrders, true);
      const dateStr = new Date().toISOString().slice(0, 10);
      return new NextResponse(csvString, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="shri_rajeshwari_deleted_orders_archive_${dateStr}.csv"`,
          'Cache-Control': 'no-store, no-cache'
        }
      });
    }

    return NextResponse.json({
      success: true,
      count: archivedOrders.length,
      orders: archivedOrders
    });
  } catch (error) {
    console.error('Error retrieving orders archive:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve deleted orders archive' }, { status: 500 });
  }
}

// DELETE /api/orders/archive - Purge the archive if admin specifically wants to clean the archive table
export async function DELETE(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    await prisma.adminSetting.deleteMany({
      where: { key: 'deleted_orders_archive' }
    });

    return NextResponse.json({
      success: true,
      message: 'Archived orders list cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing archive:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear archive' }, { status: 500 });
  }
}
