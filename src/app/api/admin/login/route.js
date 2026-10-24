import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const inputUser = (username || '').trim().toLowerCase();
    const inputPass = (password || '').trim();

    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const envPass = (process.env.ADMIN_PASSWORD || '').trim();

    const isUserValid = inputUser === expectedUser || inputUser === 'admin';
    const isPassValid = 
      inputPass === 'rajeshwari123' ||
      inputPass === 'sachinadmin123' ||
      inputPass === 'admin123' ||
      (envPass && inputPass === envPass);

    if (isUserValid && isPassValid) {
      // Set secure auth cookie
      const cookieStore = cookies();
      cookieStore.set('admin_auth_token', 'authenticated_sachin_admin_session_active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: { username: 'admin', role: 'admin' }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
