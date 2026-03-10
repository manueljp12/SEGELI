// src/services/recepcionService.js
const pool = require('../db/conexion');

/* ================================
   🔍 BUSCAR PRODUCTOS EXISTENTES
================================ */
async function buscarProductos(texto) {
    const [rows] = await pool.query(`
        SELECT 
            p.idProducto,
            p.nombreProducto,
            c.nombreCategoria,
            p.cantidad
        FROM productos p
        JOIN categoria c ON p.idCategoria = c.idCategoria
        WHERE p.nombreProducto LIKE ?
        LIMIT 10
    `, [`%${texto}%`]);

    return rows;
}

/* ================================
   ✅ RECEPCIÓN PRODUCTO EXISTENTE
================================ */
async function confirmarRecepcion(data) {
    const {
        idUsuario,
        idProducto,
        cantidadIngreso,
        precioFactura,
        precioDetal,
        fechaVencimiento,
        observacion
    } = data;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1️⃣ Crear recepción
        const [rec] = await conn.query(`
            INSERT INTO recepcion (fechaRecepcion, idUsuario, observacion)
            VALUES (NOW(), ?, ?)
        `, [idUsuario, observacion || null]);

        // 2️⃣ Detalle
        await conn.query(`
            INSERT INTO recepcion_detalle
            (idRecepcion, idProducto, cantidad, precioFactura, precioDetal, fechaVencimiento)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            rec.insertId,
            idProducto,
            cantidadIngreso,
            precioFactura,
            precioDetal,
            fechaVencimiento || null
        ]);

        // 3️⃣ Actualizar stock
        await conn.query(`
            UPDATE productos
            SET cantidad = cantidad + ?,
                precioFactura = ?,
                precioDetal = ?,
                fechaVencimiento = ?
            WHERE idProducto = ?
        `, [
            cantidadIngreso,
            precioFactura,
            precioDetal,
            fechaVencimiento || null,
            idProducto
        ]);

        await conn.commit();
        return { ok: true };

    } catch (error) {
        await conn.rollback();
        console.error('❌ Error recepción existente:', error);
        return { ok: false, message: 'Error al confirmar recepción' };
    } finally {
        conn.release();
    }
}

/* ================================
   🆕 RECEPCIÓN PRODUCTO NUEVO
   (PENDIENTE DE APROBACIÓN)
================================ */
async function recepcionarProductoNuevo(data) {
    const {
        nombreProducto,
        idCategoria,
        cantidad,
        precioFactura,
        precioDetal,
        fechaVencimiento,
        idUsuario
    } = data;

    await pool.query(`
        INSERT INTO productos_pendientes
        (nombreProducto, idCategoria, cantidad, precioFactura, precioDetal, fechaVencimiento, idUsuario)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        nombreProducto,
        idCategoria,
        cantidad,
        precioFactura,
        precioDetal,
        fechaVencimiento || null,
        idUsuario
    ]);

    return { ok: true };
}

/* ================================
   📋 LISTAR PRODUCTOS PENDIENTES
   (ADMIN)
================================ */
async function obtenerProductosPendientes() {
    const [rows] = await pool.query(`
        SELECT 
            pp.idPendiente,
            pp.nombreProducto,
            c.nombreCategoria,
            pp.cantidad,
            pp.precioFactura,
            pp.precioDetal,
            pp.fechaVencimiento,
            u.usuario
        FROM productos_pendientes pp
        JOIN categoria c ON pp.idCategoria = c.idCategoria
        JOIN usuarios u ON pp.idUsuario = u.idUsuario
        ORDER BY pp.idPendiente DESC
    `);

    return rows;
}

/* ================================
   ✅ APROBAR PRODUCTO PENDIENTE
   (ADMIN)
================================ */
async function aprobarProductoPendiente(idPendiente) {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1️⃣ Obtener pendiente
        const [[p]] = await conn.query(
            'SELECT * FROM productos_pendientes WHERE idPendiente = ?',
            [idPendiente]
        );

        if (!p) throw new Error('Producto pendiente no encontrado');

        // 2️⃣ Crear producto real
        const [producto] = await conn.query(`
            INSERT INTO productos
            (nombreProducto, idCategoria, cantidad, precioFactura, precioDetal, fechaVencimiento)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            p.nombreProducto,
            p.idCategoria,
            p.cantidad,
            p.precioFactura,
            p.precioDetal,
            p.fechaVencimiento
        ]);

        // 3️⃣ Crear recepción
        const [rec] = await conn.query(`
            INSERT INTO recepcion (fechaRecepcion, idUsuario, observacion)
            VALUES (NOW(), ?, 'Producto aprobado')
        `, [p.idUsuario]);

        // 4️⃣ Detalle
        await conn.query(`
            INSERT INTO recepcion_detalle
            (idRecepcion, idProducto, cantidad, precioFactura, precioDetal, fechaVencimiento)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            rec.insertId,
            producto.insertId,
            p.cantidad,
            p.precioFactura,
            p.precioDetal,
            p.fechaVencimiento
        ]);

        // 5️⃣ Eliminar pendiente
        await conn.query(
            'DELETE FROM productos_pendientes WHERE idPendiente = ?',
            [idPendiente]
        );

        await conn.commit();
        return { ok: true };

    } catch (error) {
        await conn.rollback();
        console.error('❌ Error aprobación:', error);
        return { ok: false, message: error.message };
    } finally {
        conn.release();
    }
}

module.exports = {
    buscarProductos,
    confirmarRecepcion,
    recepcionarProductoNuevo,
    obtenerProductosPendientes,
    aprobarProductoPendiente
};
