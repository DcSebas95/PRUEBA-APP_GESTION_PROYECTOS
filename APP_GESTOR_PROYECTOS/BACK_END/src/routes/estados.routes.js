const router = require('express').Router();
const { obtenerEstados } = require('../controllers/estados.controller');

/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Obtener todos los estados disponibles
 *     tags: [Estados]
 *     responses:
 *       200:
 *         description: Lista de estados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: Nuevo
 */
router.get('/', obtenerEstados);

module.exports = router;