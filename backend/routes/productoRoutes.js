const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const { obtenerProductos, crearProducto } = require('../controllers/productoController');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', obtenerProductos);
router.post('/', auth, adminOnly, upload.single('imagen'), crearProducto);

module.exports = router;