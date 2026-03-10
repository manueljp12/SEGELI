const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Segeli', {
    /* AUTH */
    login: (data) => ipcRenderer.invoke('login', data),
    loginSuccess: () => ipcRenderer.invoke('login-success'),
    logout: () => ipcRenderer.invoke('logout'),

    /* INVENTARIO */
    obtenerInventario: () => ipcRenderer.invoke('obtener-inventario'),
    obtenerProducto: (id) => ipcRenderer.invoke('obtener-producto', id),
    actualizarProducto: (data) => ipcRenderer.invoke('actualizar-producto', data),
    eliminarProducto: (id) => ipcRenderer.invoke('eliminar-producto', id),

    /* RECEPCIÓN */
    buscarProductos: (texto) => ipcRenderer.invoke('buscar-productos', texto),
    confirmarRecepcion: (data) => ipcRenderer.invoke('confirmar-recepcion', data),
    recepcionarProductoNuevo: (data) =>
        ipcRenderer.invoke('recepcionar-producto-nuevo', data)
});
