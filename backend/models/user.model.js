const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.avatar_url = user.avatar_url;
    this.role = user.role || 'user';
    this.status = user.status || 'active';
  }

  static async create(newUser) {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash, avatar_url, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [newUser.username, newUser.email, hashedPassword, newUser.avatar_url, newUser.role, newUser.status]
    );
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT id, username, email, avatar_url, role, status, created_at, last_login FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateLastLogin(id) {
    await db.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  static async updateProfile(id, userData) {
    const allowedFields = ['username', 'avatar_url'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return false;

    values.push(id);
    const [result] = await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }
}

module.exports = User; 