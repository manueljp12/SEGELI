console.log('Recepción JS cargado');

const buscarInput = document.getElementById('buscarProducto');
const resultados = document.getElementById('resultadosBusqueda');
const form = document.getElementById('formRecepcion');

const idProductoInput = document.getElementById('idProducto');
const nombreProductoInput = document.getElementById('nombreProducto');
const categoriaProductoInput = document.getElementById('categoriaProducto');
const cantidadActualInput = document.getElementById('cantidadActual');

const cantidadIngresoInput = document.getElementById('cantidadIngreso');
const precioFacturaInput = document.getElementById('precioFactura');
const precioDetalInput = document.getElementById('precioDetal');
const fechaVencimientoInput = document.getElementById('fechaVencimiento');

const btnNuevoProducto = document.getElementById('btnNuevoProducto');
const formNuevo = document.getElementById('formProductoNuevo');

let productoSeleccionado = null;

/* 🔍 BUSCAR PRODUCTO */
buscarInput.addEventListener('input', async () => {
    const texto = buscarInput.value.trim();

    resultados.innerHTML = '';
    productoSeleccionado = null;
    form.classList.add('hidden');
    formNuevo.classList.add('hidden');
    btnNuevoProducto.classList.add('hidden');

    if (texto.length < 2) return;

    const productos = await window.Segeli.buscarProductos(texto);

    if (productos.length === 0) {
        resultados.innerHTML = `<div class="item">Producto no encontrado</div>`;
        btnNuevoProducto.classList.remove('hidden');
        return;
    }

    productos.forEach(prod => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.textContent = `${prod.nombreProducto} (${prod.nombreCategoria})`;

        div.addEventListener('click', () => {
            seleccionarProducto(prod);
        });

        resultados.appendChild(div);
    });
});

/* ✅ SELECCIONAR PRODUCTO */
function seleccionarProducto(producto) {
    productoSeleccionado = producto;

    buscarInput.value = producto.nombreProducto;
    resultados.innerHTML = '';
    btnNuevoProducto.classList.add('hidden');

    idProductoInput.value = producto.idProducto;
    nombreProductoInput.value = producto.nombreProducto;
    categoriaProductoInput.value = producto.nombreCategoria;
    cantidadActualInput.value = producto.cantidad;

    cantidadIngresoInput.value = '';
    precioFacturaInput.value = '';
    precioDetalInput.value = '';
    fechaVencimientoInput.value = '';

    form.classList.remove('hidden');
}

/* ➕ NUEVO PRODUCTO */
btnNuevoProducto.addEventListener('click', () => {
    formNuevo.classList.remove('hidden');
    form.classList.add('hidden');
});

/* 📦 CONFIRMAR RECEPCIÓN PRODUCTO EXISTENTE */
document.getElementById('btnConfirmar').addEventListener('click', async () => {

    if (!productoSeleccionado) {
        alert('Seleccione un producto');
        return;
    }

    const cantidad = Number(cantidadIngresoInput.value);
    if (cantidad <= 0) {
        alert('Cantidad inválida');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const data = {
        idUsuario: usuario.idUsuario,
        idProducto: productoSeleccionado.idProducto,
        cantidadIngreso: cantidad,
        precioFactura: Number(precioFacturaInput.value),
        precioDetal: Number(precioDetalInput.value),
        fechaVencimiento: fechaVencimientoInput.value,
        observacion: 'Recepción de mercancía'
    };

    const result = await window.Segeli.confirmarRecepcion(data);

    if (result.ok) {
        alert('✅ Recepción confirmada');
        form.classList.add('hidden');
        buscarInput.value = '';
    } else {
        alert(result.message);
    }
});

/* 🆕 RECEPCIÓN DE PRODUCTO NUEVO */
document.getElementById('btnEnviarNuevo').addEventListener('click', async () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const data = {
        nombreProducto: document.getElementById('nuevoNombre').value.trim(),
        idCategoria: document.getElementById('nuevoCategoria').value,
        cantidad: Number(document.getElementById('nuevoCantidad').value),
        precioFactura: Number(document.getElementById('nuevoPrecioFactura').value),
        precioDetal: Number(document.getElementById('nuevoPrecioDetal').value),
        fechaVencimiento: document.getElementById('nuevoFecha').value,
        idUsuario: usuario.idUsuario
    };

    if (!data.nombreProducto || !data.idCategoria || data.cantidad <= 0) {
        alert('Complete todos los campos');
        return;
    }

    const result = await window.Segeli.recepcionarProductoNuevo(data);

    if (result.ok) {
        alert('✅ Producto enviado a aprobación');
        formNuevo.classList.add('hidden');
        buscarInput.value = '';
    } else {
        alert(result.message);
    }
});


