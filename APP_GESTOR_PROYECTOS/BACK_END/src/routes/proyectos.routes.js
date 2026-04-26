const router = require('express').Router();
const {
    obtenerProyectos,
    insertarProyecto,
    actualizarProyecto,
    eliminarProyecto
} = require('../controllers/proyectos.controller');

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Obtener proyectos con filtros opcionales
 *     tags: [Proyectos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre del proyecto
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *         description: Codigo del estado
 *       - in: query
 *         name: prioridad
 *         schema:
 *           type: integer
 *         description: Nivel de prioridad
 *       - in: query
 *         name: fecha_creacion_desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha creacion desde
 *       - in: query
 *         name: fecha_creacion_hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha creacion hasta
 *       - in: query
 *         name: fecha_entrega_desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha entrega desde
 *       - in: query
 *         name: fecha_entrega_hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha entrega hasta
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', obtenerProyectos);

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Nuevo Proyecto
 *               descripcion:
 *                 type: string
 *                 example: Descripcion del proyecto
 *               prioridad:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Error de validacion
 */
router.post('/', insertarProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   patch:
 *     summary: Actualizar proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               prioridad:
 *                 type: integer
 *               estado:
 *                 type: integer
 *               fecha_entrega:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       400:
 *         description: Error de validacion
 */
router.patch('/:id', actualizarProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar proyecto y sus tareas
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 *       400:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', eliminarProyecto);

module.exports = router;