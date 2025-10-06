const pool = require('../config/db');

const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  const imagen = req.file ? req.file.filename : null;

  try {
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, imagen, stock]
    );
    res.status(201).json({ id: result.insertId, nombre, imagen });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

module.exports = { obtenerProductos, crearProducto };