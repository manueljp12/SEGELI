async function cargarInventario() {
    try {
        const response = await window.api.obtenerInventario();
        if (!response.success) throw new Error(response.message);

        const tabla = document.getElementById('tablaInventario');
        if (!tabla) return;
        tabla.innerHTML = '';

        if (!response.data || response.data.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5;
            td.textContent = 'No hay productos registrados';
            tr.appendChild(td);
            tabla.appendChild(tr);
            return;
        }

        response.data.forEach((producto) => {
            const tr = document.createElement('tr');
            const cols = [
                producto.idProducto,
                producto.nombreProducto,
                producto.nombreCategoria,
                producto.cantidad,
                producto.cantidad <= 5 ? 'Bajo' : 'Normal'
            ];
            cols.forEach((v) => {
                const td = document.createElement('td');
                td.textContent = String(v);
                tr.appendChild(td);
            });
            tabla.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando inventario:', error);
    }
}

function initInventario() {
    cargarInventario();
}

window.initInventario = initInventario;
