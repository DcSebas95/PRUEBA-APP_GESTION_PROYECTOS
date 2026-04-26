const pool = require('../config/db');

const obtenerPrioridades = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM gestion_proyectos.prioridades'
        );
        res.json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { obtenerPrioridades };