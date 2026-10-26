import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Configure Cloudinary if environment variables are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif'
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Megabytes

export async function POST(request) {
  try {
    // 1. Verify Admin Authentication
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required to upload files.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed limit of 10MB.' },
        { status: 400 }
      );
    }

    // 3. Validate File Extension and MIME Type
    const rawExt = path.extname(file.name || '').toLowerCase();
    const mimeType = (file.type || '').toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(rawExt) || !ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Only JPG, PNG, WEBP, GIF, and AVIF images are allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Option A: If Cloudinary is configured (e.g. on Vercel cloud hosting), upload directly to Cloudinary CDN
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'sri_rajeshwari_crackers',
        resource_type: 'image'
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        filename: uploadResult.public_id
      });
    }

    // Option B: Fallback to local disk storage for development
    const rawBase = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `cracker-${rawBase.slice(0, 30)}-${Date.now()}${rawExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
