// lib/materialQRService.js
import pool from './mysql'; // đường dẫn tới file kết nối MySQL pool

export async function getAllMaterialQR() {
  const [rows] = await pool.query('SELECT * FROM MaterialQR');
  return rows;
}


export async function getMaterialQRById(id) {
  const [rows] = await pool.query('SELECT * FROM MaterialQR WHERE id = ?', [id]);
  return rows.length ? rows[0] : null;
}

export async function addMaterialQR(data) {
  const { Material_Name, Supplier_Name, Supplier_Material_Name, Material_Name_By_Supplier, Ref_num } = data;

  const [result] = await pool.query(
    `INSERT INTO MaterialQR 
     (Material_Name, Supplier_Name, Supplier_Material_Name, Material_Name_By_Supplier, Ref_num)
     VALUES (?, ?, ?, ?, ?)`,
    [Material_Name, Supplier_Name, Supplier_Material_Name, Material_Name_By_Supplier, Ref_num]
  );
  return result.insertId;
}

export async function deleteMaterialQRById(id) {
  const [result] = await pool.query('DELETE FROM MaterialQR WHERE ID = ?', [id]);
  return result.affectedRows; // số dòng bị xóa (0 hoặc 1)
}

export async function deleteMaterialQRByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;

  // Tạo chuỗi dấu hỏi tương ứng số phần tử
  const placeholders = ids.map(() => '?').join(',');
  const [result] = await pool.query(`DELETE FROM MaterialQR WHERE ID IN (${placeholders})`, ids);
  return result.affectedRows; // số dòng bị xóa
}
