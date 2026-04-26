const pool = require('../config/db');

const obtenerProyectos = async (req, res, next) => {
    try {
        const {
            id,
            nombre,
            estado,
            prioridad,
            fecha_creacion_desde,
            fecha_creacion_hasta,
            fecha_entrega_desde,
            fecha_entrega_hasta
        } = req.query;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_obtiene_proyectos(
                $1::INTEGER,
                $2::VARCHAR,
                $3::INTEGER,
                $4::INTEGER,
                $5::TIMESTAMP,
                $6::TIMESTAMP,
                $7::DATE,
                $8::DATE
            )`,
            [
                id || null,
                nombre || null,
                estado || null,
                prioridad || null,
                fecha_creacion_desde || null,
                fecha_creacion_hasta || null,
                fecha_entrega_desde || null,
                fecha_entrega_hasta || null
            ]
        );

        res.json({
            ok: true,
            total: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

const insertarProyecto = async (req, res, next) => {
    try {
        const { nombre, descripcion, prioridad } = req.body;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_insert_proyecto($1, $2, $3)`,
            [nombre, descripcion || null, prioridad || 1]
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Proyecto creado correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

const actualizarProyecto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            prioridad,
            estado,
            fecha_entrega
        } = req.body;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_update_proyecto(
                $1::INTEGER,
                $2::VARCHAR,
                $3::TEXT,
                $4::INTEGER,
                $5::INTEGER,
                $6::DATE
            )`,
            [
                id,
                nombre || null,
                descripcion || null,
                prioridad || null,
                estado ?? null,
                fecha_entrega === '' ? null : fecha_entrega
            ]
        );

        res.json({
            ok: true,
            mensaje: 'Proyecto actualizado correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

const eliminarProyecto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_delete_proyecto($1::INTEGER)`,
            [id]
        );

        res.json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerProyectos,
    insertarProyecto,
    actualizarProyecto,
    eliminarProyecto
};