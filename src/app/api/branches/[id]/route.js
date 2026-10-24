import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// PUT /api/branches/[id] - Protected Admin update
export async function PUT(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to update branch locations.' },
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
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.pincode !== undefined) updateData.pincode = body.pincode;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.secondaryPhone !== undefined) updateData.secondaryPhone = body.secondaryPhone;
    if (body.googleMapsUrl !== undefined) updateData.googleMapsUrl = body.googleMapsUrl;
    if (body.isMainBranch !== undefined) updateData.isMainBranch = Boolean(body.isMainBranch);

    const updated = await prisma.branchLocation.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, branch: updated });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update branch' }, { status: 500 });
  }
}

// DELETE /api/branches/[id] - Protected Admin deletion
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to delete branch locations.' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.branchLocation.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Branch location deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete branch' }, { status: 500 });
  }
}
