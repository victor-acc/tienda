// backend/models/Producto.js
const pool = require('../config/db');

class Producto {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM productos');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ nombre, descripcion, precio, imagen, stock }) {
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, imagen, stock]
    );
    return { id: result.insertId, nombre, imagen };
  }
}

module.exports = Producto;