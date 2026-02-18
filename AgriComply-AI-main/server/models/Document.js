const path = require('path');
const db = require('../config/db');

class Document {
  static async create(data) {
    const sql = 'INSERT INTO documents (user_id, file_path, tag) VALUES (?, ?, ?)';
    const [result] = await db.execute(sql, [data.user_id, data.filename, data.tag]);
    return { id: result.insertId, ...data };
  }

  static normalizeDoc(row) {
    const storedName = row.file_path || row.filename || '';
    const ext = path.extname(storedName).toLowerCase();
    const mimetype = ext === '.pdf' ? 'application/pdf' : 'image/jpeg';

    return {
      id: row.id,
      user_id: row.user_id,
      filename: storedName,
      file_name: storedName,
      file_path: storedName,
      tag: row.tag,
      upload_date: row.upload_date,
      type: mimetype,
      size: 0,
    };
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT id, user_id, file_path, tag, upload_date
      FROM documents
      WHERE user_id = ?
      ORDER BY upload_date DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows.map((row) => Document.normalizeDoc(row));
  }

  static async findById(id) {
    const sql = 'SELECT id, user_id, file_path, tag, upload_date FROM documents WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    if (!rows.length) return null;
    return Document.normalizeDoc(rows[0]);
  }

  static async delete(id) {
    const sql = 'DELETE FROM documents WHERE id = ?';
    const [result] = await db.execute(sql, [id]);
    return result;
  }

  static async update(id, data) {
    const sql = 'UPDATE documents SET file_path = ?, upload_date = NOW() WHERE id = ?';
    const [result] = await db.execute(sql, [data.filename, id]);
    return result;
  }
}

module.exports = Document;
