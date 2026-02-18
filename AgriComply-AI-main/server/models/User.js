const db = require('../config/db');

class User {
  static async create(name, email, password, role = 'Farmer') {
    try {
      return await db.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );
    } catch (err) {
      // Backward compatibility if existing DB schema does not yet have `role` column.
      if (err && err.code === 'ER_BAD_FIELD_ERROR') {
        return db.execute(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, password]
        );
      }
      throw err;
    }
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = User;
