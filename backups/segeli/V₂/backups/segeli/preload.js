const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api',{
    login: (usuario, contraseña) =>{
        return ipcRenderer.invoke('login', {usuario, contraseña});
    }
});