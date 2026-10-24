import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCachedProducts, setCachedProducts, invalidateProductsCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const macroCategory = searchParams.get('macroCategory');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'sNo-asc';

    let allProducts = getCachedProducts();
    if (!allProducts) {
      allProducts = await prisma.product.findMany({
        orderBy: { sNo: 'asc' }
      });
      setCachedProducts(allProducts);
    }

    let filtered = [...allProducts];

    if (macroCategory && macroCategory !== 'All') {
      filtered = filtered.filter(p => p.macroCategory === macroCategory);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock && p.stock > 0);
    }

    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.sNo.toString() === q
      );
    }

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'discount') filtered.sort((a, b) => b.discount - a.discount);
    else filtered.sort((a, b) => a.sNo - b.sNo);

    return NextResponse.json({
      success: true,
      count: filtered.length,
      products: filtered
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      tamilName = '',
      category,
      macroCategory = 'Daylight',
      unit = '1 Box',
      originalPrice,
      price,
      stock = 100,
      inStock = true,
      image = '/images/illustration-diwali-crackers.avif',
      description = '',
      featured = false
    } = body;

    if (!name || originalPrice === undefined || price === undefined || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, Category, Original Price and Final Price are required' },
        { status: 400 }
      );
    }

    // Auto compute sNo if not provided
    const lastProduct = await prisma.product.findFirst({
      orderBy: { sNo: 'desc' }
    });
    const sNo = body.sNo ? Number(body.sNo) : (lastProduct ? lastProduct.sNo + 1 : 1);

    const numOriginal = Number(originalPrice);
    const numPrice = Number(price);
    const discount = numOriginal > 0 ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 80;

    const newProduct = await prisma.product.create({
      data: {
        sNo,
        name,
        tamilName,
        category,
        macroCategory,
        unit,
        originalPrice: numOriginal,
        price: numPrice,
        discount: discount > 0 ? discount : 80,
        stock: Number(stock),
        inStock: Boolean(inStock),
        image,
        description,
        featured: Boolean(featured)
      }
    });

    invalidateProductsCache();

    return NextResponse.json({
      success: true,
      product: newProduct
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
