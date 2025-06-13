// lib/materialQRService.js
import pool from './mysql'; // đường dẫn tới file kết nối MySQL pool
import moment from 'moment-timezone';

function formatDateForMySQL(dateStr) {
  if (!dateStr || isNaN(Date.parse(dateStr))) return null;
  // Chuyển đúng sang UTC+7 nhưng không đổi giờ gốc
  return moment.tz(dateStr, 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
}

export async function getAllMaterialQR() {
  const [rows] = await pool.query('SELECT * FROM MaterialQR');
  return rows;
}


export async function getMaterialQRById(id) {
  const [rows] = await pool.query('SELECT * FROM MaterialQR WHERE id = ?', [id]);
  return rows.length ? rows[0] : null;
}


export async function addMaterialQR(list) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("Dữ liệu không hợp lệ hoặc rỗng");
  }

  const columns = Object.keys(list[0]); // giả định tất cả các dòng có cùng keys
  const columnList = columns.map(col => `\`${col}\``).join(', ');

  const values = [];
  const placeholders = list.map(row => {
    const rowValues = columns.map(col => row[col]);
    values.push(...rowValues); // gom tất cả các giá trị vào 1 mảng
    return `(${columns.map(() => '?').join(', ')})`;
  });

  const sql = `INSERT INTO MaterialQR (${columnList}) VALUES ${placeholders.join(', ')}`;

  const [result] = await pool.query(sql, values);
  return result.insertId;
}



export async function updateMaterialQRById(id, updatedData) {
  if ('id' in updatedData) {
    delete updatedData.id;
  }

  // ✅ Format các trường ngày nếu có
  const dateFields = [
    'DateChanged_Material',
    'DateChanged_MaterialSupplier',
    'DateCreated_Material',
    'DateCreated_MaterialSupplier'
  ];

  for (const field of dateFields) {
    if (field in updatedData) {
      updatedData[field] = formatDateForMySQL(updatedData[field]);
    }
  }

  const fields = Object.keys(updatedData);
  const values = Object.values(updatedData);

  if (fields.length === 0) return;

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const query = `UPDATE MaterialQR SET ${setClause} WHERE id = ?`;

  await pool.query(query, [...values, id]);
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
