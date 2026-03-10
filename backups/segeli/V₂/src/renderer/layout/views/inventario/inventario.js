console.log('Inventario JS ejecutándose');


const tabla = document.getElementById('tablaInventario');
const buscador = document.getElementById('buscarProducto');
let productos = [];
const editId = document.getElementById('editId');
const editNombre = document.getElementById('editNombre');
const editCantidad = document.getElementById('editCantidad');
const editPrecio = document.getElementById('editPrecio');
const btnCancelar = document.getElementById('btnCancelar');
const btnGuardar = document.getElementById('btnGuardar');
const modal = document.getElementById('modalEditar');



function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0   // si quiere que mueste decimales cambiar el 0 por la cantidad de decimales que se quiere mostrar eje: cambiar 0 por 2
    }).format(valor);
}


async function cargarInventario() {
    try {
        console.log('Llamando a obtenerInventario...');
        productos = await window.Segeli.obtenerInventario();
        console.log('Productos recibidos:', productos);
        renderTabla(productos);
    } catch (error) {
        console.error('Error cargando inventario:', error);
        tabla.innerHTML = `
            <tr>
                <td colspan="5">Error al cargar inventario</td>
            </tr>
        `;
    }
}

function renderTabla(data) {
    tabla.innerHTML = '';

    if (data.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5">No hay productos</td>
            </tr>
        `;
        return;
    }
    data.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prod.idProducto}</td>
            <td>${prod.nombreProducto}</td>
            <td>${prod.nombreCategoria}</td>
            <td>${prod.cantidad}</td>
            <td>${formatearPrecio(prod.precioDetal)}</td>
            <td>
                <button class="btn-editar" data-id="${prod.idProducto}">Editar</button>
                <button class="btn-eliminar" data-id="${prod.idProducto}">Eliminar</button>
            </td>

        `;
        tabla.appendChild(tr);
    });
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const producto = await window.Segeli.obtenerProducto(id);

            editId.value = producto.idProducto;
            editNombre.value = producto.nombreProducto;
            editCantidad.value = producto.cantidad;
            editPrecio.value = producto.precioDetal;

            abrirModal();
        });

    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;

            const confirmar = confirm('¿Seguro que deseas eliminar este producto?');

            if (!confirmar) return;

            const result = await window.Segeli.eliminarProducto(id);

            if (result.ok) {
                await cargarInventario();
            } else {
                alert(result.message);
            }
        });
    });
}

buscador.addEventListener('input', e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(p =>
        p.nombreProducto.toLowerCase().includes(texto)
    );
    renderTabla(filtrados);
});

// 🚀 EJECUTAR MANUALMENTE
cargarInventario();



btnGuardar.addEventListener('click', async () => {
    const producto = {
        idProducto: editId.value,
        nombreProducto: editNombre.value.trim(),
        cantidad: Number(editCantidad.value),
        precioDetal: Number(editPrecio.value)
    };

    if (!producto.nombreProducto) {
        alert('El nombre es obligatorio');
        return;
    }

    const result = await window.Segeli.actualizarProducto(producto);

    if (result.ok) {
        cerrarModal();
        await cargarInventario();
    } else {
        alert(result.message);
    }
});




function abrirModal() {
    modal.classList.remove('hidden');
}

function cerrarModal() {
    modal.classList.add('hidden');
}

btnCancelar.addEventListener('click', cerrarModal);

