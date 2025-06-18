const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rota para cadastro de usuários
router.post('/', usuariosController.cadastrar);

// Rota para remover usuário pelo email
router.delete('/:email', usuariosController.remover);

module.exports = router;
