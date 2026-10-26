import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/calendars/[id]
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid calendar ID' }, { status: 400 });
    }

    const calendar = await prisma.calendarProduct.findUnique({ where: { id } });
    if (!calendar) {
      return NextResponse.json({ success: false, error: 'Calendar product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, calendar });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

// PUT /api/calendars/[id] - Protected Admin update
export async function PUT(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to modify calendar products.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid calendar ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.tamilName !== undefined) updateData.tamilName = body.tamilName.trim();
    if (body.type !== undefined) updateData.type = body.type.trim();
    if (body.paperGsm !== undefined) updateData.paperGsm = body.paperGsm.trim();
    if (body.size !== undefined) updateData.size = body.size.trim();
    if (body.originalPrice !== undefined) updateData.originalPrice = Number(body.originalPrice);
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.inStock !== undefined) updateData.inStock = Boolean(body.inStock);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);
    if (body.minOrderQty !== undefined) updateData.minOrderQty = Number(body.minOrderQty);
    if (body.features !== undefined) {
      updateData.features = typeof body.features === 'string' ? body.features : JSON.stringify(body.features);
    }

    const updated = await prisma.calendarProduct.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, calendar: updated });
  } catch (error) {
    console.error('Error updating calendar product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update calendar product' }, { status: 500 });
  }
}

// DELETE /api/calendars/[id] - Protected Admin deletion
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to delete calendar products.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid calendar ID' }, { status: 400 });
    }

    await prisma.calendarProduct.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Calendar product removed successfully' });
  } catch (error) {
    console.error('Error deleting calendar product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete calendar product' }, { status: 500 });
  }
}
