document.addEventListener('DOMContentLoaded', () => {
    const inputUsuario = document.getElementById('user');
    const inputPassword = document.getElementById('pass');
    const btnLogin = document.getElementById('but');
    const message = document.getElementById('text');

    btnLogin.addEventListener('click',async () =>{
        const usuario = inputUsuario.value.trim();
        const contraseña = inputPassword.value.trim();
        const respuesta = await window.api.login(usuario, contraseña);
        if (respuesta.ok){
            message.textContent = respuesta.message;
            message.style.color = 'green' ;
        } else {
            message.textContent = respuesta.message;
            message.style.color = 'red'
        }
    });
});
