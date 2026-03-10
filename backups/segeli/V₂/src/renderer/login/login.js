console.log('login.js cargado');

document.addEventListener('DOMContentLoaded', () =>{ 
    const inputUsuario = document.getElementById('user') 
    const inputPassword = document.getElementById('password') 
    const btnLogin = document.getElementById('btnLogin') 
    const message = document.getElementById('error') 
    
    btnLogin.addEventListener('click', async () => {
        const usuario = inputUsuario.value.trim();
        const password = inputPassword.value.trim();

        message.textContent = '';

        if (!usuario || !password) {
            message.textContent = 'Complete todos los campos';
            return;
        }

        const result = await window.Segeli.login({ usuario, password });

        // 🔥 AQUÍ ESTABA EL ERROR
        if (!result.ok) {
            message.textContent = result.message;
            return;
        }

        localStorage.setItem('usuario', JSON.stringify(result.user));
        window.Segeli.loginSuccess();
    });
    
});