const pool = require('../config/db');

const obtenerEstados = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM gestion_proyectos.estados'
        );
        res.json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { obtenerEstados };