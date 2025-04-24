const express = require('express');
const router = express.Router();
const populateController = require('../controllers/populateController');
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * /api/populate:
 *   post:
 *     summary: Imports data from ZIP files
 *     tags: [Populate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful import
 *       500:
 *         description: Import error
 */
router.post('/', authenticateJWT, populateController.populateDatabase);

module.exports = router;

