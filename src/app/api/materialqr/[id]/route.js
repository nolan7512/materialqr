import { getMaterialQRById } from '@/lib/materialQRService';

export async function GET(req, { params }) {
  const id = params.id;
  const result = await getMaterialQRById(id);
  if (!result) {
    return Response.json({ message: 'Không tìm thấy' }, { status: 404 });
  }
  return Response.json(result);
}
