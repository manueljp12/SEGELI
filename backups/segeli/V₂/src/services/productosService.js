const db = require('../db/conexion'); // ajusta si tu conexión tiene otro nombre

async function buscarProductos(texto) {
    const sql = `
        SELECT 
            p.idProducto,
            p.nombreProducto,
            c.nombreCategoria,
            p.cantidad,
            p.precioDetal
        FROM productos p
        LEFT JOIN categorias c ON c.idCategoria = p.idCategoria
        WHERE 
            p.nombreProducto LIKE ?
            OR p.idProducto LIKE ?
        LIMIT 10
    `;

    const like = `%${texto}%`;
    const [rows] = await db.query(sql, [like, like]);
    return rows;
}

module.exports = {
    buscarProductos
};
