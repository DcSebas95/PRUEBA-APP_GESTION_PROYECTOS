const router = require('express').Router();
const { obtenerEstados } = require('../controllers/estados.controller');
//swagger para visualizacion de respuestas
/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Obtener todas las prioridades
 *     tags: [Estados]
 *     responses:
 *       200:
 *         description: Lista de prioridades
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
 *                       nivel:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: Alta
 */
router.get('/', obtenerEstados);

module.exports = router;