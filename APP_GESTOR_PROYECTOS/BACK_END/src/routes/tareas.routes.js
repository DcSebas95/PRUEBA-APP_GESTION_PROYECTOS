const router = require('express').Router({ mergeParams: true });
const {
    obtenerTareas,
    insertarTarea,
    actualizarTarea,
    eliminarTarea
} = require('../controllers/tareas.controller');

/**
 * @swagger
 * /api/proyectos/{proyecto_id}/tareas:
 *   get:
 *     summary: Obtener tareas de un proyecto
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: proyecto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Titulo de la tarea
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *         description: Codigo del estado
 *       - in: query
 *         name: fecha_creacion_desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_creacion_hasta
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_limite_desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_limite_hasta
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_entrega_desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_entrega_hasta
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de tareas del proyecto
 *       400:
 *         description: Proyecto no encontrado
 */
router.get('/', obtenerTareas);

/**
 * @swagger
 * /api/proyectos/{proyecto_id}/tareas:
 *   post:
 *     summary: Crear nueva tarea en un proyecto
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: proyecto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Nueva Tarea
 *               descripcion:
 *                 type: string
 *                 example: Descripcion de la tarea
 *               fecha_limite:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Error de validacion
 */
router.post('/', insertarTarea);

/**
 * @swagger
 * /api/proyectos/{proyecto_id}/tareas/{id}:
 *   patch:
 *     summary: Actualizar tarea de un proyecto
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: proyecto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: integer
 *               fecha_limite:
 *                 type: string
 *                 format: date
 *               fecha_entrega:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       400:
 *         description: Error de validacion
 */
router.patch('/:id', actualizarTarea);

/**
 * @swagger
 * /api/proyectos/{proyecto_id}/tareas/{id}:
 *   delete:
 *     summary: Eliminar tarea de un proyecto
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: proyecto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       400:
 *         description: Tarea no encontrada
 */
router.delete('/:id', eliminarTarea);

module.exports = router;