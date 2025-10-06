// backend/models/Pedido.js
const pool = require('../config/db');

class Pedido {
  static async create(id_usuario, total) {
    const [result] = await pool.execute(
      'INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)',
      [id_usuario, total]
    );
    return result.insertId;
  }

  static async addProducto(id_pedido, id_producto, cantidad, precio_unitario) {
    await pool.execute(
      'INSERT INTO productos_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [id_pedido, id_producto, cantidad, precio_unitario]
    );
  }

  static async getByUsuario(id_usuario) {
    const [rows] = await pool.execute(
      `SELECT p.id, p.total, p.estado, p.creado_en,
              GROUP_CONCAT(pr.nombre SEPARATOR ', ') as productos
       FROM pedidos p
       LEFT JOIN productos_pedidos pp ON p.id = pp.id_pedido
       LEFT JOIN productos pr ON pp.id_producto = pr.id
       WHERE p.id_usuario = ?
       GROUP BY p.id`,
      [id_usuario]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT p.id, p.total, p.estado, p.creado_en, u.nombre_completo as cliente
       FROM pedidos p
       JOIN usuarios u ON p.id_usuario = u.id`
    );
    return rows;
  }
}

module.exports = Pedido;