// app/api/materialqr/route.js
import {
    addMaterialQR,
    deleteMaterialQRById,
    deleteMaterialQRByIds,
    getAllMaterialQR,
} from '@/lib/materialQRService'; // đường dẫn tới file service

export async function POST(req) {
    const body = await req.json();
    try {
        await addMaterialQR(body);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function DELETE(req) {
    const body = await req.json(); // { id: 1 } hoặc { ids: [1,2,3] }
    try {
        if (body.id) {
            await deleteMaterialQRById(body.id);
        } else if (body.ids) {
            await deleteMaterialQRByIds(body.ids);
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function GET() {
    try {
      const data = await getAllMaterialQR();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }