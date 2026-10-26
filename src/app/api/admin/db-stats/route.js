import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { getDatabaseStorageStats } from '@/lib/order-archive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/admin/db-stats - Return live database size and storage quota from Neon AWS
export async function GET(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const stats = await getDatabaseStorageStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching db stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch database storage metrics' }, { status: 500 });
  }
}
