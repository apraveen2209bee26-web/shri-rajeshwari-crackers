import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';
import { archiveOrders } from '@/lib/order-archive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// PATCH /api/orders/[id] - Update order task status (In Progress, Packed, Delivered, etc.)
export async function PATCH(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid status is required' }, { status: 400 });
    }

    const orderId = Number(id);
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status.trim() }
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order status' }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete single order and safely persist to deleted orders CSV archive
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const orderId = Number(id);

    const orderToDelete = await prisma.order.findUnique({ where: { id: orderId } });
    if (!orderToDelete) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // 1. Archive order to persistent AdminSetting so it's preserved forever in CSV
    await archiveOrders([orderToDelete]);

    // 2. Delete from live active orders table
    await prisma.order.delete({ where: { id: orderId } });

    return NextResponse.json({
      success: true,
      message: `Order #${orderToDelete.orderRef} deleted and safely preserved in CSV archive`,
      deletedOrder: orderToDelete
    });
  } catch (error) {
    console.error('Error deleting single order:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
  }
}
