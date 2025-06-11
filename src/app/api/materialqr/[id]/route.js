// route.js trong /api/materialqr/[id]/route.js

import { getMaterialQRById } from '@/lib/materialQRService';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  const { id } = await context.params; // ✅ context là object có key 'params'

  try {
    const material = await getMaterialQRById(id);
    if (!material) {
      return NextResponse.json({ message: 'Không tìm thấy material' }, { status: 404 });
    }

    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi server', error: error.message }, { status: 500 });
  }
}
