const express = require('express');
const { registrar, login, forgotPassword, resetPassword, obtenerPerfil } = require('../controllers/authController');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.get('/me', auth, obtenerPerfil);
router.post('/register', registrar);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;