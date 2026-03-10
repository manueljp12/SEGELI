const {
    buscarProductos,
    confirmarRecepcion,
    recepcionarProductoNuevo
} = require('../services/recepcionServices');

/* 🔍 Buscar productos */
async function buscarProductosController(req, res) {
    try {
        const { texto } = req.query;

        if (!texto || texto.trim().length < 2) {
            return res.json([]);
        }

        const productos = await buscarProductos(texto.trim());
        res.json(productos);

    } catch (error) {
        console.error('❌ Error al buscar productos:', error);
        res.status(500).json({ message: 'Error al buscar productos' });
    }
}

/* ✅ Confirmar recepción de producto existente */
async function confirmarRecepcionController(req, res) {
    try {
        const data = req.body;

        const result = await confirmarRecepcion(data);

        if (result.ok) {
            res.json({ ok: true });
        } else {
            res.status(400).json(result);
        }

    } catch (error) {
        console.error('❌ Error al confirmar recepción:', error);
        res.status(500).json({
            ok: false,
            message: 'Error interno al confirmar recepción'
        });
    }
}

/* 🆕 Recepcionar producto nuevo (pendiente de aprobación) */
async function recepcionarProductoNuevoController(req, res) {
    try {
        const data = req.body;

        await recepcionarProductoNuevo(data);

        res.json({
            ok: true,
            message: 'Producto enviado a pendientes para aprobación'
        });

    } catch (error) {
        console.error('❌ Error al recepcionar producto nuevo:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al registrar producto nuevo'
        });
    }
}

module.exports = {
    buscarProductosController,
    confirmarRecepcionController,
    recepcionarProductoNuevoController
};
