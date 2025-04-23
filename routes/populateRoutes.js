const express = require('express');
const router = express.Router();
const populateController = require('../controllers/populateController');

/**
 * @swagger
 * /api/populate:
 *   post:
 *     summary: Imports data from ZIP files
 *     tags: [Populate]
 *     responses:
 *       200:
 *         description: Successful import
 *       500:
 *         description: Import error
 */
router.post('/', populateController.populateDatabase);

module.exports = router;
