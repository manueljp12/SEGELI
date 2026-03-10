const pool = require('./conexion');

async function test() {
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('✅ Conexión a MySQL exitosa');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
}

test();
