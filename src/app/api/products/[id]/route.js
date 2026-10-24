import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { invalidateProductsCache } from '@/lib/cache';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to modify products.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.tamilName !== undefined) updateData.tamilName = body.tamilName;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.macroCategory !== undefined) updateData.macroCategory = body.macroCategory;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.inStock !== undefined) updateData.inStock = Boolean(body.inStock);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);

    if (body.originalPrice !== undefined) {
      updateData.originalPrice = Number(body.originalPrice);
    }
    if (body.price !== undefined) {
      updateData.price = Number(body.price);
    }

    if (updateData.originalPrice !== undefined || updateData.price !== undefined) {
      const existing = await prisma.product.findUnique({ where: { id } });
      const orig = updateData.originalPrice !== undefined ? updateData.originalPrice : (existing ? existing.originalPrice : 0);
      const net = updateData.price !== undefined ? updateData.price : (existing ? existing.price : 0);
      if (orig > 0) {
        updateData.discount = Math.round(((orig - net) / orig) * 100);
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData
    });

    invalidateProductsCache();

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to delete products.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id }
    });

    invalidateProductsCache();

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
