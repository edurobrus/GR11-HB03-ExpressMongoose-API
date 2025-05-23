const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Endpoints for restaurant management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique restaurant ID generated by MongoDB.
 *         name:
 *           type: string
 *           description: Name of the restaurant.
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: ['Point']
 *               description: Geospatial data type.
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Geographic coordinates [longitude, latitude].
 *         country_code:
 *           type: number
 *           description: Country code.
 *         city:
 *           type: string
 *           description: City where the restaurant is located.
 *         address:
 *           type: string
 *           description: Restaurant address.
 *         cuisines:
 *           type: string
 *           description: Types of cuisine offered.
 *         average_cost_for_two:
 *           type: number
 *           description: Average cost for two people.
 *         currency:
 *           type: string
 *           description: Currency used.
 *         has_table_booking:
 *           type: boolean
 *           description: Indicates whether the restaurant allows table bookings.
 *         has_online_delivery:
 *           type: boolean
 *           description: Indicates whether the restaurant offers online delivery.
 *         aggregate_rating:
 *           type: number
 *           description: Aggregate rating of the restaurant.
 *         votes:
 *           type: number
 *           description: Number of votes received.
 *       example:
 *         _id: "661feaf8bc3e2a9c1234abcd"
 *         name: "Le Petit Souffle"
 *         location:
 *           type: "Point"
 *           coordinates: [121.027535, 14.565443]
 *         avg_rating: 4.8
 *         type: "RESTAURANT"
 *         total_ratings: 314
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Maximum number of restaurants to return."
 *     responses:
 *       200:
 *         description: List of restaurants retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/", restaurantController.getRestaurants);

/**
 * @swagger
 * /api/restaurants/nearby:
 *   get:
 *     summary: Get nearby restaurants
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the user's location.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the user's location.
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: integer
 *         description: Maximum distance in meters.
 *     responses:
 *       200:
 *         description: List of nearby restaurants retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/nearby", authenticateJWT, restaurantController.getNearbyRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the restaurant to retrieve.
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found.
 */
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;
