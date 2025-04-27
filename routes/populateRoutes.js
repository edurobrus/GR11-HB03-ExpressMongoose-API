const express = require('express');
const router = express.Router();
const populateController = require('../controllers/populateController');

/**
 * @swagger
 * tags:
 *   name: Data Import
 *   description: Endpoints for import data management
 */

/**
 * @swagger
 * /api/populate:
 *   post:
 *     tags: [Data Import]
 *     summary: Start the data import from files.
 *     description: |
 *       Start the data import process to MongoDB from files.
 *       
 *       **Communication flow:**
 *       1. Execute this endpoint to start the import
 *       2. Connect to the provided WebSocket to receive updates
 *       3. Listen for real-time progress events
 *       
 *     produces:
 *       - application/json
 *     responses:
 *       202:
 *         description: Import started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Import started
 *                 websocket:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "ws://localhost:3000"
 *                     events:
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
 *         description: Error starting the import
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Detailed error..."
 *     externalDocs:
 *       description: Full WebSocket events documentation
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