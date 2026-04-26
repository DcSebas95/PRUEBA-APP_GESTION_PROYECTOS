const router = require('express').Router();
const { obtenerPrioridades } = require('../controllers/prioridades.controller');
//swagger para visualizacion de respuestas
/**
 * @swagger
 * /api/prioridades:
 *   get:
 *     summary: Obtener todas las prioridades
 *     tags: [Prioridades]
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
router.get('/', obtenerPrioridades);

module.exports = router;