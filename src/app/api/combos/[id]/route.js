import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/combos/[id]
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const combo = await prisma.comboOffer.findUnique({ where: { id } });
    if (!combo) {
      return NextResponse.json({ success: false, error: 'Combo offer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, combo });
  } catch (error) {
    console.error('Error fetching combo:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch combo offer' }, { status: 500 });
  }
}

// PUT /api/combos/[id] - Protected Admin update
export async function PUT(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to update combo offers.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.tamilTitle !== undefined) updateData.tamilTitle = body.tamilTitle;
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.active !== undefined) updateData.active = Boolean(body.active);
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);
    if (body.totalMarketPrice !== undefined) updateData.totalMarketPrice = Number(body.totalMarketPrice);
    if (body.offerPrice !== undefined) updateData.offerPrice = Number(body.offerPrice);
    if (body.itemsCount !== undefined) updateData.itemsCount = Number(body.itemsCount);
    if (body.highlights !== undefined) {
      updateData.highlights = typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights);
    }
    if (body.itemsJson !== undefined) {
      updateData.itemsJson = typeof body.itemsJson === 'string' ? body.itemsJson : JSON.stringify(body.itemsJson);
      try {
        const parsed = JSON.parse(updateData.itemsJson);
        updateData.itemsCount = parsed.length;
      } catch (e) {}
    }

    const updated = await prisma.comboOffer.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, combo: updated });
  } catch (error) {
    console.error('Error updating combo offer:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update combo offer' }, { status: 500 });
  }
}

// DELETE /api/combos/[id] - Protected Admin deletion
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to delete combo offers.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.comboOffer.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Combo offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting combo offer:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete combo offer' }, { status: 500 });
  }
}
