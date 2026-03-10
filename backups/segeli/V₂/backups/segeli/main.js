const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const { electron } = require('process');
let mainWindow;


function crearVentana() {
    mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences:{
            preload: path.join(__dirname, 'preload.js'), 
            contextIsolation: true
        }
    });

    mainWindow.loadFile('renderer/login/login.html')

}

ipcMain.handle('login', (event, data ) =>{
    const {usuario, contraseña} = data;
    if (usuario === 'admin' && contraseña === '123'){
        mainWindow.loadFile('renderer/home/home.html')
        return{
            ok: true
        };
    } else {
        return{
        ok: false,
        message: 'usuario o contraseña incorrectos'
        };
    }
})
app.whenReady().then(()=> {
    crearVentana();
});


