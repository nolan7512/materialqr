// route.js trong /api/materialqr/[id]/route.js

import { getMaterialQRById, updateMaterialQRById  } from '@/lib/materialQRService';
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


export async function PUT(req, context) {
  // const { id } = context.params;
  const { id } = await context.params
  const body = await req.json();

  try {
    const material = await getMaterialQRById(id);
    if (!material) {
      return NextResponse.json({ message: 'Không tìm thấy material để cập nhật' }, { status: 404 });
    }

    await updateMaterialQRById(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi cập nhật material', error: error.message }, { status: 500 });
  }
}
