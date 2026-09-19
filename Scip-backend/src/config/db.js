const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos un pool de conexiones para mejor rendimiento en la concurrencia de consultas
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'scip_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificamos que se puede conectar
pool.getConnection()
    .then(connection => {
        console.log('Conexión exitosa a la base de datos MySQL (scip_db).');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });

module.exports = pool;
