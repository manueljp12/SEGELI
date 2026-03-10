document.addEventListener('DOMContentLoaded',() =>{
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const main = document.getElementById('content');
    let productoEditandoIndex = null;

    let productos = [
        {
            nombre: 'Aguardiente',
            categoria: 'Licores',
            precio: 50000,
            stock: 10
        },
        {
            nombre: 'Aguila',
            categoria: 'Bebidas',
            precio: 3500,
            stock: 15
        },
        {
            nombre:'Cocacola',
            categoria: 'Gaseosa',
            precio: 5000,
            stock: 5
        }
    ]

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
   

    function cargarDashboard(){
        main.innerHTML = '';
        main.innerHTML = `
            <h1 class="titlle-bienvenido">Bienvenido a Segeli</h1>
            <p class="resumen-sistema">Resumen general del sistema</p>
            <div class = "cards">
                <div class = "card">
                    <h3>Total Productos</h3>
                    <p>120</p>
                </div>
                <div class="card">
                    <h3>Ventas Hoy</h3>
                    <p>15</p>
                </div>
                <div class="card">
                    <h3>Stock Bajo</h3>
                    <p>3</p>
                </div>

            </div> 
            <h2>Top 5 productos más vendidos</h2>
            <ul>
                <li>Producto 1</li>
                <li>Producto 2</li>
                <li>Producto 3</li>
                <li>Producto 4</li>
                <li>Producto 5</li>
            </ul>
        `;
    };
    cargarDashboard();

    function renderizarProductos(){
        const tbody = document.querySelector('.tabla-productos tbody');
        tbody.innerHTML = '';
        productos.forEach((producto, index) =>{
            const fila = document.createElement('tr');

            fila.innerHTML =`
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class = "btn-editar" data-index="${index}">Editar</button>
                    <button class = "btn-eliminar" data-index="${index}">eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-eliminar')){
            const index = e.target.dataset.index;
            eliminarProducto(index);
        }
    });

    function eliminarProducto(index){
        const confirmar = confirm('¿Seguro que deseas eliminar este producto?');
        if(!confirmar) return;

        productos.splice(index, 1);

        renderizarProductos();
    }

    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-editar')){
            const index = Number(e.target.dataset.index);
            cargarFormularioEdicion(index);
        }
    })

    function cargarFormularioEdicion(index){
        const producto = productos[index];
        productoEditandoIndex = index;

        main.innerHTML=`
        <h1 class = "edit-producto">Editar producto</h1>
        <form id="form-editar-producto">
            <input type = "text" id="nombre" value="${producto.nombre}" required>
            <input type="text" id="categoria" value="${producto.categoria}" required>
            <input type="Number" id="precio" value="${producto.precio}" required>
            <input type="Number" id="stock" value="${producto.stock}" required>

            <button type="submit">Guardar cambios</button>
            <button type="button" id="cancelar-edicion" >Cancelar</button> 
        </form>
        
        `;
    }

    document.addEventListener('submit', (e) => {
        if(e.target.id ==='form-editar-producto'){
            e.preventDefault();

            const productoActulizado = {
                nombre: document.getElementById('nombre').value.trim(),
                categoria: document.getElementById('categoria').value.trim(),
                precio: Number(document.getElementById('precio').value),
                stock: Number(document.getElementById('stock').value)
            }
            if(!validarProducto(productoActulizado, productoEditandoIndex)) return;

            productos[productoEditandoIndex] = productoActulizado;
            productoEditandoIndex = null;

            cargarProductos();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.id === 'cancelar-edicion'){
            cargarProductos();
        }
    });

    function cargarProductos(){
        main.innerHTML = '';
        main.innerHTML =`
            <h1 class = "titlle-inventario" >Inventario</h1>
            <div class = "busqueda-modificar">
                <input type = "text" id= "busqueda-productos" placeholder = " Buscar producto....">
            
                <button class="btn-agregar">Agregar producto</button>
            </div>

            <table class = "tabla-productos" id="tabla-productos">
            
                <thead>
                    <tr class="name-fila" id="name-fila">
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
            
                <tbody></tbody>

            </table>
        `;

        renderizarProductos();

        const inputBusqueda = document.getElementById('busqueda-productos');
        inputBusqueda.addEventListener('input', () => {
            const texto = inputBusqueda.value.toLowerCase();
            const filas = document.querySelectorAll('.tabla-productos tbody tr')
            
            filas.forEach(fila => {
                const nombre = fila.children[0].textContent.toLowerCase();
                fila.style.display = nombre.includes(texto) ? '' : 'none';
            })
        })
   
    };

    

    const opcionesMenu = document.querySelectorAll('.sidebar li');

        opcionesMenu.forEach(opcion =>{

            opcion.addEventListener('click',() => {

                opcionesMenu.forEach(item => {
                    item.classList.remove('active')
                });

                opcion.classList.add('active')

                const seccion = opcion.dataset.seccion;

                if(seccion ==='inicio'){
                    cargarDashboard();
                };
                if(seccion ==='productos'){
                    cargarProductos();
                };

            });
        });

    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-agregar')){
            cargarFormularioAgregar();
        }
    });
    function cargarFormularioAgregar(){
        productoEditandoIndex = null;

        main.innerHTML=`
        <h1>Agregar productos</h1>

        <form id = "from-agregar-producto">
            <input type="text" id="nombre" placeholder="Nombre" required>
            <input type="text" id="categoria" placeholder="Categoria" required>
            <input type="Number" id="precio" placeholder="Precio" required>
            <input type="Number" id="stock" placeholder="stock" required>

            <button type="submit" >Guardar</button>
            <button type="button" id="cancelar-agregar">Cancelar</button>
        </form>
        `
    }

    document.addEventListener('submit', (e) => {
        
        if(e.target.id === 'from-agregar-producto'){
            e.preventDefault();

            const nuevoProducto = {
                nombre: document.getElementById('nombre').value.trim(),
                categoria: document.getElementById('categoria').value.trim(),
                precio: Number(document.getElementById('precio').value),
                stock: Number(document.getElementById('stock').value)
            };

            if(!validarProducto(nuevoProducto)) 
                return;

            productos.push(nuevoProducto);

            cargarProductos();
        }
    });

    document.addEventListener('click', (e) => {
        if(e.target.id === 'cancelar-agregar'){
            cargarProductos();
        }
    });

    function validarProducto(producto, indexEditando = null){
        if(
            !producto.nombre ||
            !producto.categoria ||
            producto.precio === '' ||
            producto.stock === ''
        ){
            alert('todos los datos son obligatorios');
            return false;
        }

        if (producto.precio <= 0){
            alert('El precio no puede ser negativo');
            return false;
        }

        if (producto.stock <= 0){
            alert('El stock no puede ser negativo');
            return false;
        }

        const nombreExiste = productos.some((p, index) => {
            if(indexEditando !== null && index === Number(indexEditando)){
                return false;
            }
            return p.nombre.toLowerCase() === producto.nombre.toLowerCase();
        });
        if(nombreExiste){
            alert('ya existe un proucto con ese nombre');
            return false;
        }

        return true;
    }
});
