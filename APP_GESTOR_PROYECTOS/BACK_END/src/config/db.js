const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Verificar conexion
pool.connect()
    .then(() => console.log('Conectado'))
    .catch(err => console.error('Error conectando ', err));

module.exports = pool;