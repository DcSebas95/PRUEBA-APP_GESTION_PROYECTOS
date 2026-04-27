const pool = require('../config/db');

// Obtener tareas de un proyecto
const obtenerTareas = async (req, res, next) => {
    try {
        const { proyecto_id } = req.params;
        const {
            titulo,
            estado,
            fecha_creacion_desde,
            fecha_creacion_hasta,
            fecha_limite_desde,
            fecha_limite_hasta,
            fecha_entrega_desde,
            fecha_entrega_hasta
        } = req.query;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_obtener_tareas(
                $1::INTEGER,
                $2::VARCHAR,
                $3::INTEGER,
                $4::TIMESTAMP,
                $5::TIMESTAMP,
                $6::DATE,
                $7::DATE,
                $8::DATE,
                $9::DATE
            )`,
            [
                proyecto_id,
                titulo || null,
                estado || null,
                fecha_creacion_desde || null,
                fecha_creacion_hasta || null,
                fecha_limite_desde || null,
                fecha_limite_hasta || null,
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

// Insertar tarea
const insertarTarea = async (req, res, next) => {
    try {
        const { proyecto_id } = req.params;
        const { titulo, descripcion, fecha_limite } = req.body;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_insert_tarea(
                $1::INTEGER,
                $2::VARCHAR,
                $3::TEXT,
                $4::DATE
            )`,
            [
                proyecto_id,
                titulo,
                descripcion || null,
                fecha_limite || null
            ]
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Tarea creada correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar tarea
const actualizarTarea = async (req, res, next) => {
    try {
        const { proyecto_id, id } = req.params;
        const {
            titulo,
            descripcion,
            estado,
            fecha_limite,
            fecha_entrega
        } = req.body;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_update_tarea(
                $1::INTEGER,
                $2::INTEGER,
                $3::VARCHAR,
                $4::TEXT,
                $5::INTEGER,
                $6::DATE,
                $7::DATE
            )`,
            [
                proyecto_id,
                id,
                titulo || null,
                descripcion || null,
                estado ?? null,
                fecha_limite || null,
                fecha_entrega || null
            ]
        );

        res.json({
            ok: true,
            mensaje: 'Tarea actualizada correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar tarea
const eliminarTarea = async (req, res, next) => {
    try {
        const { proyecto_id, id } = req.params;

        const result = await pool.query(
            `SELECT * FROM gestion_proyectos.sp_delete_tarea(
                $1::INTEGER,
                $2::INTEGER
            )`,
            [proyecto_id, id]
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
    obtenerTareas,
    insertarTarea,
    actualizarTarea,
    eliminarTarea
};