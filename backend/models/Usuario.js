// backend/models/Usuario.js
const pool = require('../config/db');

class Usuario {
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT u.id, u.nombre_completo, u.correo, r.nombre as rol FROM usuarios u JOIN roles r ON u.id_rol = r.id WHERE u.id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByEmail(correo) {
    const [rows] = await pool.execute(
      'SELECT u.id, u.nombre_completo, u.correo, u.contraseña, r.nombre as rol FROM usuarios u JOIN roles r ON u.id_rol = r.id WHERE u.correo = ?',
      [correo]
    );
    return rows[0] || null;
  }

  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT u.id, u.nombre_completo, u.correo, r.nombre as rol FROM usuarios u JOIN roles r ON u.id_rol = r.id'
    );
    return rows;
  }

  static async create(nombre_completo, correo, contraseña, id_rol = 2) {
    const hashedPass = require('bcryptjs').hashSync(contraseña, 10);
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, correo, contraseña, id_rol) VALUES (?, ?, ?, ?)',
      [nombre_completo, correo, hashedPass, id_rol]
    );
    return result.insertId;
  }

  static async updatePassword(correo, nuevaContraseña) {
    const hashedPass = require('bcryptjs').hashSync(nuevaContraseña, 10);
    const [result] = await pool.execute(
      'UPDATE usuarios SET contraseña = ? WHERE correo = ?',
      [hashedPass, correo]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Usuario;