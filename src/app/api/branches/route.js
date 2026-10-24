import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/branches - Public list of branch locations
export async function GET() {
  try {
    const branches = await prisma.branchLocation.findMany({
      orderBy: [
        { isMainBranch: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      count: branches.length,
      branches
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch branch locations' }, { status: 500 });
  }
}

// POST /api/branches - Protected Admin branch creation
export async function POST(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to add branch locations.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      tamilName = '',
      address,
      city = 'Sivakasi',
      pincode = '626123',
      phone = '',
      secondaryPhone = '',
      googleMapsUrl = '',
      isMainBranch = false
    } = body;

    if (!name || !address) {
      return NextResponse.json(
        { success: false, error: 'Branch name and address are required.' },
        { status: 400 }
      );
    }

    const mapUrl = googleMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(`${name}, ${address}, ${city} ${pincode}`)}`;

    const newBranch = await prisma.branchLocation.create({
      data: {
        name,
        tamilName,
        address,
        city,
        pincode,
        phone,
        secondaryPhone,
        googleMapsUrl: mapUrl,
        isMainBranch: Boolean(isMainBranch)
      }
    });

    return NextResponse.json({ success: true, branch: newBranch }, { status: 201 });
  } catch (error) {
    console.error('Error creating branch location:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create branch' }, { status: 500 });
  }
}
