const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Endpoints for location management
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
 *           description: Name of the location
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *               description: Must be "Point"
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               minItems: 2
 *               maxItems: 2
 *               description: Coordinates in [longitude, latitude] format
 *         avg_rating:
 *           type: number
 *           description: Average rating of the location
 *         total_ratings:
 *           type: number
 *           description: Total number of ratings
 *         type:
 *           type: string
 *           enum: [CITY, RESTAURANT]
 *           description: Whether it's a CITY or RESTAURANT
 *       required:
 *         - name
 *         - location
 *         - avg_rating
 *         - total_ratings
 *         - type
 *       example:
 *         _id: "661feaf8bc3e2a9c1234abcd"
 *         name: "Le Petit Souffle"
 *         location:
 *           type: "Point"
 *           coordinates: [121.027535, 14.565443]
 *         avg_rating: 4.8
 *         total_ratings: 314
 *         type: "RESTAURANT"
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
router.get('/nearby', authenticateJWT, locationController.getNearbyLocations);

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
router.put('/:id/rating', authenticateJWT, locationController.updateLocationRating);

module.exports = router;
