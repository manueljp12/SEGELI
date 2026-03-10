const pool = require('../db/conexion');

async function obtenerInventario() {
    const [rows] = await pool.query(`
        SELECT 
            p.idProducto,
            p.nombreProducto,
            c.nombreCategoria,
            p.cantidad,
            p.precioDetal
        FROM productos p
        INNER JOIN categoria c ON p.idCategoria = c.idCategoria
        ORDER BY p.nombreProducto
    `);

    return rows;
}

async function obtenerProductoPorId(idProducto) {
    const [rows] = await pool.query(
        `SELECT 
            p.idProducto,
            p.nombreProducto,
            p.idCategoria,
            p.cantidad,
            p.precioFactura,
            p.precioDetal,
            p.fechaVencimiento
         FROM productos p
         WHERE p.idProducto = ?`,
        [idProducto]
    );

    return rows[0];
}

async function actualizarProducto(producto) {
    const { idProducto, nombreProducto, cantidad, precioDetal } = producto;

    await pool.query(
        `UPDATE productos 
         SET nombreProducto = ?, cantidad = ?, precioDetal = ?
         WHERE idProducto = ?`,
        [nombreProducto, cantidad, precioDetal, idProducto]
    );

    return true;
}

async function eliminarProducto(idProducto) {
    await pool.query(
        'DELETE FROM productos WHERE idProducto = ?',
        [idProducto]
    );
}


module.exports = {
    obtenerInventario,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
