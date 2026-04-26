const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Configurar el schema gestion_proyectos
pool.on('connect', (client) => {
    client.query('SET search_path TO gestion_proyectos, public');
});

// Verificar conexion
pool.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error conectando a PostgreSQL', err));

module.exports = pool;