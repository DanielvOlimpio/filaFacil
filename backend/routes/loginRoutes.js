const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rota para login de usuários
router.post('/', usuariosController.login);

module.exports = router;
