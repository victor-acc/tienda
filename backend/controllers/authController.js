const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const enviarCorreo = require('../utils/enviarCorreo');

const registrar = async (req, res) => {
  const { nombre_completo, correo, contraseña } = req.body;
  try {
    const hashedPass = await bcrypt.hash(contraseña, 10);
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, correo, contraseña, id_rol) VALUES (?, ?, ?, 2)',
      [nombre_completo, correo, hashedPass]
    );
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT u.id, u.nombre_completo, u.correo, u.contraseña, r.nombre as rol FROM usuarios u JOIN roles r ON u.id_rol = r.id WHERE u.correo = ?',
      [correo]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Credenciales inválidas' });

    const user = rows[0];
    const validPass = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPass) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: { id: user.id, nombre: user.nombre_completo, correo: user.correo, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const forgotPassword = async (req, res) => {
  const { correo } = req.body;
  const token = jwt.sign({ correo }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const expira = new Date(Date.now() + 3600000); // 1 hora

  try {
    await pool.execute(
      'INSERT INTO recuperacion_contraseña (correo, token, expira_en) VALUES (?, ?, ?)',
      [correo, token, expira]
    );

    // Enviar correo (simulado aquí, puedes usar enviarCorreo.js)
    console.log(`Token de recuperación para ${correo}: ${token}`);
    // await enviarCorreo(correo, 'Recupera tu contraseña', `Haz clic: http://localhost:3000/reset-password/${token}`);

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
const obtenerPerfil = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT u.id, u.nombre_completo, u.correo, r.nombre as rol FROM usuarios u JOIN roles r ON u.id_rol = r.id WHERE u.id = ?',
      [req.usuario.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const user = rows[0];
    res.json({
      id: user.id,
      nombre: user.nombre_completo,
      correo: user.correo,
      rol: user.rol
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
const resetPassword = async (req, res) => {
  const { token, nuevaContraseña } = req.body;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }

  const hashedPass = await bcrypt.hash(nuevaContraseña, 10);
  try {
    const [result] = await pool.execute(
      'UPDATE usuarios SET contraseña = ? WHERE correo = ?',
      [hashedPass, decoded.correo]
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    await pool.execute('UPDATE recuperacion_contraseña SET usado = 1 WHERE token = ?', [token]);
    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};

module.exports = { registrar, login, forgotPassword, resetPassword, obtenerPerfil };