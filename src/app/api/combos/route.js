import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/combos - Public list of combo offers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    const where = includeInactive ? {} : { active: true };
    const combos = await prisma.comboOffer.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json({
      success: true,
      count: combos.length,
      combos
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching combo offers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch combo offers' }, { status: 500 });
  }
}

// POST /api/combos - Protected Admin creation
export async function POST(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to create combo offers.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      tamilTitle = '',
      badge = 'MEGA SAVER',
      itemsCount = 0,
      image = '/images/illustration-diwali-crackers.avif',
      totalMarketPrice = 0,
      offerPrice,
      description = '',
      highlights = [],
      itemsJson = '[]',
      active = true,
      sortOrder = 0
    } = body;

    if (!title || offerPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Combo title and revised offer price are required.' },
        { status: 400 }
      );
    }

    // Auto-generate slug
    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `combo-${Date.now()}`;
    const slug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const newCombo = await prisma.comboOffer.create({
      data: {
        slug,
        title,
        tamilTitle,
        badge,
        itemsCount: Number(itemsCount) || (typeof itemsJson === 'string' ? JSON.parse(itemsJson).length : itemsJson.length),
        image,
        totalMarketPrice: Number(totalMarketPrice) || 0,
        offerPrice: Number(offerPrice) || 0,
        description,
        highlights: typeof highlights === 'string' ? highlights : JSON.stringify(highlights),
        itemsJson: typeof itemsJson === 'string' ? itemsJson : JSON.stringify(itemsJson),
        active: Boolean(active),
        sortOrder: Number(sortOrder) || 0
      }
    });

    return NextResponse.json({ success: true, combo: newCombo }, { status: 201 });
  } catch (error) {
    console.error('Error creating combo offer:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create combo offer' }, { status: 500 });
  }
}
