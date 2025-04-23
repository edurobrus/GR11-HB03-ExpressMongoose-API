const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: API for managing locations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Location ID
 *         name:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               minItems: 2
 *               maxItems: 2
 *         avg_rating:
 *           type: number
 *         total_ratings:
 *           type: number
 *         type:
 *           type: string
 *           enum: [CITY, RESTAURANT]
 *       required:
 *         - name
 *         - location
 *         - avg_rating
 *         - total_ratings
 *         - type
 */

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Server error
 */
router.get('/', locationController.getLocations);

/**
 * @swagger
 * /api/locations/nearby:
 *   get:
 *     summary: Get locations near the provided coordinates
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: integer
 *         description: Maximum distance in meters
 *     responses:
 *       200:
 *         description: List of nearby locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Server error
 */
router.get('/nearby', locationController.getNearbyLocations);

/**
 * @swagger
 * /api/locations/top-rated:
 *   get:
 *     summary: Get the top 5 highest-rated locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of top-rated locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Server error
 */
router.get('/top-rated', locationController.getTopRatedLocations);

/**
 * @swagger
 * /api/locations/most-voted:
 *   get:
 *     summary: Get the top 5 most voted locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of most voted locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Server error
 */
router.get('/most-voted', locationController.getMostVotedLocations);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get a location by its ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.get('/:id', locationController.getLocationById);

/**
 * @swagger
 * /api/locations/{id}/rating:
 *   put:
 *     summary: Update the average rating of a location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Location ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avg_user
 *             properties:
 *               avg_user:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.5
 *     responses:
 *       200:
 *         description: Location updated
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.put('/:id/rating', locationController.updateLocationRating);

module.exports = router;
