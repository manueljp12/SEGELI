const bcrypt = require('bcrypt');
const pool = require('../db/conexion');

async function reset() {
    const hash = await bcrypt.hash('190920', 10);

    await pool.query(
        'UPDATE usuarios SET password = ? WHERE usuario = "admin"',
        [hash]
    );

    console.log('✅ Contraseña reseteada a: 190920');
    process.exit();
}

reset();
