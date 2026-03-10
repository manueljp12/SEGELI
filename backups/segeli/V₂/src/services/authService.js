const bcrypt = require('bcrypt');
const pool = require('../db/conexion');

async function login(usuario, password) {

    console.log('🟡 Usuario recibido:', usuario);
    console.log('🟡 Password recibido:', `"${password}"`);

    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE usuario = ?',
        [usuario]
    );

    if (rows.length === 0) {
        return { ok: false, message: 'Usuario no existe' };
    }

    const user = rows[0];
    console.log('🟡 Hash BD:', user.password);

    const match = await bcrypt.compare(password, user.password);
    console.log('🟡 Resultado bcrypt:', match);

    if (!match) {
        return { ok: false, message: 'Contraseña incorrecta' };
    }

    return {
        ok: true,
        user: {
            id: user.idUsuario,
            usuario: user.usuario,
            nombreCompleto: `${user.nombres} ${user.apellidos}`,
            rol: user.idRol
        }
    };
}

module.exports = { login };
