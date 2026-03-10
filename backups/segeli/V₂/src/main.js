const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

/* SERVICES */
const { login } = require('./services/authService');
const {
    obtenerInventario,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
} = require('./services/inventarioService');

const {
    buscarProductos,
    confirmarRecepcion,
    recepcionarProductoNuevo
} = require('./services/recepcionService');

let loginWindow = null;
let mainWindow = null;

/* ---------------- LOGIN WINDOW ---------------- */

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    loginWindow.loadFile(
        path.join(__dirname, 'renderer/login/login.html')
    );
}

/* ---------------- MAIN WINDOW ---------------- */

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    mainWindow.loadFile(
        path.join(__dirname, 'renderer/layout/layout.html')
    );
}

/* ---------------- APP READY ---------------- */

app.whenReady().then(createLoginWindow);

/* ---------------- AUTH ---------------- */

ipcMain.handle('login', (_, credenciales) =>
    login(credenciales.usuario, credenciales.password)
);

ipcMain.handle('login-success', () => {
    if (loginWindow) loginWindow.close();
    if (!mainWindow) createMainWindow();
});

ipcMain.handle('logout', () => {
    if (mainWindow) mainWindow.close();
    createLoginWindow();
});

/* ---------------- INVENTARIO ---------------- */

ipcMain.handle('obtener-inventario', obtenerInventario);

ipcMain.handle('obtener-producto', (_, id) =>
    obtenerProductoPorId(id)
);

ipcMain.handle('actualizar-producto', (_, data) =>
    actualizarProducto(data)
);

ipcMain.handle('eliminar-producto', (_, id) =>
    eliminarProducto(id)
);

/* ---------------- RECEPCIÓN ---------------- */

ipcMain.handle('buscar-productos', (_, texto) =>
    buscarProductos(texto)
);

ipcMain.handle('confirmar-recepcion', (_, data) =>
    confirmarRecepcion(data)
);

ipcMain.handle('recepcionar-producto-nuevo', (_, data) =>
    recepcionarProductoNuevo(data)
);

/* ---------------- CLOSE ---------------- */

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
