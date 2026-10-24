import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { STORE_CONFIG } from '@/lib/constants';
import { getCachedSettings, setCachedSettings, invalidateSettingsCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cached = getCachedSettings();
    if (cached) {
      return NextResponse.json({
        success: true,
        settings: cached
      }, {
        headers: {
          'Cache-Control': 'public, max-age=5, stale-while-revalidate=30'
        }
      });
    }

    const settingsList = await prisma.adminSetting.findMany();
    const settingsMap = {};
    settingsList.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    const settings = {
      shop_name: settingsMap['shop_name'] || STORE_CONFIG.name,
      whatsapp_number: settingsMap['whatsapp_number'] || STORE_CONFIG.whatsappNumber,
      secondary_phone: settingsMap['secondary_phone'] || STORE_CONFIG.secondaryPhone,
      address: settingsMap['address'] || STORE_CONFIG.address,
    };

    setCachedSettings(settings);

    return NextResponse.json({
      success: true,
      settings
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: true,
      settings: {
        shop_name: STORE_CONFIG.name,
        whatsapp_number: STORE_CONFIG.whatsappNumber,
        secondary_phone: STORE_CONFIG.secondaryPhone,
        address: STORE_CONFIG.address,
      }
    });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { whatsapp_number, secondary_phone, shop_name, address } = body;

    const updates = [];

    if (whatsapp_number !== undefined) {
      const cleanWa = whatsapp_number.replace(/[^0-9]/g, '');
      updates.push(
        prisma.adminSetting.upsert({
          where: { key: 'whatsapp_number' },
          update: { value: cleanWa },
          create: { key: 'whatsapp_number', value: cleanWa }
        })
      );
    }

    if (secondary_phone !== undefined) {
      updates.push(
        prisma.adminSetting.upsert({
          where: { key: 'secondary_phone' },
          update: { value: secondary_phone },
          create: { key: 'secondary_phone', value: secondary_phone }
        })
      );
    }

    if (shop_name !== undefined) {
      updates.push(
        prisma.adminSetting.upsert({
          where: { key: 'shop_name' },
          update: { value: shop_name },
          create: { key: 'shop_name', value: shop_name }
        })
      );
    }

    if (address !== undefined) {
      updates.push(
        prisma.adminSetting.upsert({
          where: { key: 'address' },
          update: { value: address },
          create: { key: 'address', value: address }
        })
      );
    }

    await Promise.all(updates);
    invalidateSettingsCache();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
