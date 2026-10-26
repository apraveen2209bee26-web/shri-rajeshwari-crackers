import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/calendars - Public list of calendar products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';

    const where = includeAll ? {} : { inStock: true };
    const calendars = await prisma.calendarProduct.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      count: calendars.length,
      calendars
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch calendar products' }, { status: 500 });
  }
}

// POST /api/calendars - Protected Admin creation
export async function POST(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to manage calendars.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      tamilName = '',
      type = 'Wirebound / Spiral Flip Wall',
      paperGsm = '130 to 170 GSM Art Paper',
      size = 'Standard',
      originalPrice = 0,
      price,
      stock = 100,
      inStock = true,
      image = '/images/calendars/daily-slip-calendar.jpg',
      description = '',
      features = [],
      minOrderQty = 1,
      featured = false,
      sortOrder = 0
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Calendar name and selling price are required.' },
        { status: 400 }
      );
    }

    // Auto-generate clean unique slug
    let baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    if (!baseSlug) baseSlug = 'calendar-' + Date.now();
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.calendarProduct.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const calendar = await prisma.calendarProduct.create({
      data: {
        slug,
        name: name.trim(),
        tamilName: (tamilName || '').trim(),
        category: 'Calendars',
        type: type.trim(),
        paperGsm: (paperGsm || '130 to 170 GSM Art Paper').trim(),
        size: (size || 'Standard').trim(),
        originalPrice: Number(originalPrice) || 0,
        price: Number(price),
        stock: Number(stock) >= 0 ? Number(stock) : 100,
        inStock: Boolean(inStock),
        image: image || '/images/calendars/daily-slip-calendar.jpg',
        description: (description || '').trim(),
        features: typeof features === 'string' ? features : JSON.stringify(features),
        minOrderQty: Number(minOrderQty) || 1,
        featured: Boolean(featured),
        sortOrder: Number(sortOrder) || 0
      }
    });

    return NextResponse.json({ success: true, calendar }, { status: 201 });
  } catch (error) {
    console.error('Error creating calendar product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create calendar product' }, { status: 500 });
  }
}
