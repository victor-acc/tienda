// backend/routes/usuarioRoutes.js
const express = require('express');
const { auth } = require('../middleware/auth');
const { obtenerUsuarios, obtenerPerfil } = require('../controllers/usuarioController');
const router = express.Router();

router.get('/perfil', auth, obtenerPerfil);
router.get('/', auth, obtenerUsuarios); // Solo admin debería acceder, pero lo validamos en middleware si quieres

module.exports = router;