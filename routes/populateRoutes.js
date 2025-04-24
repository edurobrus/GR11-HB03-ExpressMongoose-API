const express = require('express');
const router = express.Router();
const populateController = require('../controllers/populateController');

/**
 * @swagger
 * /api/populate:
 *   post:
 *     tags:
 *       - Data Import
 *     summary: Inicia la importación de datos desde archivos ZIP
 *     description: |
 *       Inicia el proceso de importación de datos a MongoDB desde archivos ZIP.
 *       
 *       **Flujo de comunicación:**
 *       1. Ejecuta este endpoint para iniciar la importación
 *       2. Conéctate al WebSocket proporcionado para recibir actualizaciones
 *       3. Escucha los eventos de progreso en tiempo real
 *       
 *     produces:
 *       - application/json
 *     responses:
 *       202:
 *         description: Importación iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Importación iniciada
 *                 websocket:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "ws://localhost:3000"
 *                     eventos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "import:start"
 *                         - "import:zip"
 *                         - "import:file"
 *                         - "import:progress"
 *                         - "import:done"
 *                         - "import:error"
 *       500:
 *         description: Error al iniciar la importación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error detallado..."
 *     externalDocs:
 *       description: Documentación completa de eventos WebSocket
 */
router.post('/', async (req, res) => {
    try {
        await populateController.triggerImport(req.app.locals.wsClients);
        res.status(202).json({ 
            message: 'Importación iniciada',
            websocket: {
                url: `ws://${req.headers.host}`,
                eventos: [
                    'import:start',
                    'import:zip',
                    'import:file',
                    'import:progress',
                    'import:done',
                    'import:error'
                ]
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al iniciar la importación',
            detalles: error.message
        });
    }
});

module.exports = router;