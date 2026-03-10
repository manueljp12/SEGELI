document.addEventListener('DOMContentLoaded', () =>{
    const menuBut = document.getElementById('butMenu')
    const sidebar = document.getElementById('sidebar')
    const contenido = document.getElementById('contenido')
    const opcionesMenu = document.querySelectorAll('.sidebar li');
    let scriptActual = null;
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
        // No hay sesión → volver al login
        window.location.href = '../login/login.html';
        return;
    }

    const userData = JSON.parse(usuario);
    document.getElementById('usuarioLogueado').textContent = userData.nombreCompleto;

    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('usuario');
        window.Segeli.logout();
    });
    


    //abrir / cerrar sidebar
    menuBut.addEventListener('click', () => {
        sidebar.classList.toggle('active')
    });


//click en opciones del menu
    opcionesMenu.forEach(opcion => {

        opcion.addEventListener('click', () => {

            //marcar activo
            opcionesMenu.forEach(item =>{
                item.classList.remove('active')
            })
            opcion.classList.add('active')

            const seccion = opcion.dataset.seccion;
            cargarVista(seccion)

        });       
    })

    // cargar vista inicial
    cargarVista('home');

    //||-------------------------||
    //|| Cargar vistas dinamicas ||
    //||-------------------------||

    function cargarVista(seccion){
        const rutaHtml = `./views/${seccion}/${seccion}.html`;
        const rutaCss = `./views/${seccion}/${seccion}.css`;
        const rutaJs = `./views/${seccion}/${seccion}.js`;
       
        fetch(rutaHtml)
            .then(response =>{
               if (!response.ok){
                    throw new Error('no se puede cargar la vista');
                }
                return response.text()
            })
            .then(html => {
                contenido.innerHTML = html;
                cargarCss(rutaCss);
                cargarJs(rutaJs);
            })
            .catch(error => {
                contenido.innerHTML = `
                <h2>Error</h2>
                <p>No se pudo cargar la vista: ${seccion}</p>
                `;
                console.error(error);
            })
    }

    //-------------------------------
    // Cargar Css dinamico
    //-------------------------------
    function cargarCss(ruta){

        //eliminar CSS anterior
        const cssAnterior = document.getElementById('vista-css');
        if(cssAnterior) cssAnterior.remove();

        const link = document.createElement('link')
        link.rel = 'stylesheet';
        link.href = ruta + '?v=' + new Date().getTime();    // evita cache
        link.id = 'vista-css';

        document.head.appendChild(link);
    }

    //-----------------------------
    //Cargar js dinamico
    //-----------------------------

    function cargarJs(ruta){
        //elimicar script anterior
        if(scriptActual){
            scriptActual.remove();
            scriptActual = null;
        }

        const script = document.createElement('script');
        script.src = ruta;
        script.defer = true;

        script.onload = () => {
            console.log(`Script ${ruta} cargado correctamente`);
        };

        document.body.appendChild(script);
        scriptActual = script;
    }
})