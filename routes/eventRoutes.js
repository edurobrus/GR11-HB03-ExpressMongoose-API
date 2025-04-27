const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Endpoints for event management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "680c07167e835634218013f8"
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         locations:
 *           type: array
 *           items:
 *             type: string
 *         organizer_id:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/events/:
 *   post:
 *     summary: Create a new event using query params
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema: { type: string }
 *         example: "Rock Concert"
 *       - in: query
 *         name: description
 *         schema: { type: string }
 *         example: "Live music event"
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         example: "2024-12-31T20:00:00.000Z"
 *       - in: query
 *         name: locations
 *         schema: { type: string }
 *         description: Comma-separated IDs
 *         example: "67c25101b3f3867b9b0908ec"
 *       - in: query
 *         name: price
 *         schema: { type: number }
 *         example: 50
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         example: "Music"
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "680c07167e835634218013f8"
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: string
 *                 organizer_id:
 *                   type: string
 *                 participants:
 *                   type: array
 *                   items: 
 *                     type: string
 *                 status:
 *                   type: string
 *                 category:
 *                   type: string
 *                 price:
 *                   type: number
 *             example:
 *               _id: "680c07167e835634218013f8"
 *               name: "Rock Concert"
 *               description: "Live music event"
 *               date: "2024-12-31T20:00:00.000Z"
 *               locations: ["67c25101b3f3867b9b0908ec"]
 *               organizer_id: "680c000cf534f14f7dd72d93"
 *               participants: []
 *               status: "active"
 *               category: "Music"
 *               price: 50
 */
router.post("/", authenticateJWT, eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Complete event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *             example:
 *               _id: "680c07167e835634218013f8"
 *               name: "Rock Concert"
 *               description: "Live music event"
 *               date: "2024-12-31T20:00:00.000Z"
 *               locations: ["67c25101b3f3867b9b0908ec"]
 *               organizer_id: "680c000cf534f14f7dd72d93"
 *               participants: []
 *               status: "active"
 *               category: "Music"
 *               price: 50
 *               createdAt: "2024-05-10T09:00:00.000Z"
 *               updatedAt: "2024-05-10T09:00:00.000Z"
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid ID
 */
router.get("/:id", eventController.getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event by query params
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: description
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: locations
 *         schema: { type: string }
 *       - in: query
 *         name: price
 *         schema: { type: number }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event updated
 */
router.put("/:id", authenticateJWT, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted
 *       400:
 *         description: Invalid event ID
 *       403:
 *         description: Not authorized to delete the event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateJWT, eventController.deleteEvent);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoints for transaction management
 */

/**
 * @swagger
 * /api/events/{eventId}/transactions:
 *   post:
 *     summary: Create a new transaction for an event
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: 
 *           type: string
 *         description: Event ID
 *     responses:
 *       201:
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             example:
 *               payment_url: "https://checkout.stripe.com/pay/pi_1J..."
 *               client_secret: "pi_1J..._secret_XYZ..."
 *               amount: 99.99
 *               currency: "eur"
 *               transaction_id: "665f4d8e1b3f3867b9b0912a"
 *       400:
 *         description: Error in input parameters
 *       404:
 *         description: Resource not found (event/user)
 *       500:
 *         description: Internal server error
 */
router.post("/:eventId/transactions", authenticateJWT, eventController.createTransaction);

module.exports = router;