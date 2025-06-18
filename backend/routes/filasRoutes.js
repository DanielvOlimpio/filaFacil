const express = require('express');
const router = express.Router();
const filasController = require('../controllers/filasController');

// Rota para cadastrar usuário na fila
router.post('/', filasController.cadastrar);

// Rota para consultar fila do usuário pelo email
router.get('/:email', filasController.consultar);

module.exports = router;
