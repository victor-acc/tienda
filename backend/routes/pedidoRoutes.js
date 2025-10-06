// backend/routes/pedidoRoutes.js
const express = require('express');
const { auth } = require('../middleware/auth');
const { crearPedido, obtenerMisPedidos, obtenerTodosPedidos } = require('../controllers/pedidoController');
const router = express.Router();

router.post('/', auth, crearPedido);
router.get('/mis-pedidos', auth, obtenerMisPedidos);
router.get('/', auth, obtenerTodosPedidos); // Puedes agregar adminOnly si solo admin ve todos

module.exports = router;