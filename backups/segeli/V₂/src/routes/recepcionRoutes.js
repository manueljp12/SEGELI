const express = require('express');
const router = express.Router();

const {
    buscarProductosController,
    confirmarRecepcionController,
    recepcionarProductoNuevoController
} = require('../controllers/recepcionController');

/* 🔍 Buscar productos */
router.get('/buscar', buscarProductosController);

/* ✅ Confirmar recepción */
router.post('/confirmar', confirmarRecepcionController);

/* 🆕 Producto nuevo (pendiente) */
router.post('/nuevo', recepcionarProductoNuevoController);

module.exports = router;
