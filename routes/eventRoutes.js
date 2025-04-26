const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gestión de eventos mediante parámetros URL
 */

/**
 * @swagger
 * /api/events/create:
 *   get:
 *     summary: Crear nuevo evento por query params
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema: { type: string }
 *         example: "Concierto de Rock"
 *       - in: query
 *         name: description
 *         schema: { type: string }
 *         example: "Evento musical en vivo"
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         example: "2024-12-31T20:00:00.000Z"
 *       - in: query
 *         name: locations
 *         schema: { type: string }
 *         description: IDs separados por comas
 *         example: "67c25101b3f3867b9b0908ec"
 *       - in: query
 *         name: price
 *         schema: { type: number }
 *         example: 50
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         example: "Música"
 *     responses:
 *       201:
 *         description: Evento creado
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
 *               name: "Concierto de Rock"
 *               description: "Evento musical en vivo"
 *               date: "2024-12-31T20:00:00.000Z"
 *               locations: ["67c25101b3f3867b9b0908ec"]
 *               organizer_id: "680c000cf534f14f7dd72d93"
 *               participants: []
 *               status: "active"
 *               category: "Música"
 *               price: 50
 */
router.get("/create", authenticateJWT, eventController.createEvent);

/**
 * @swagger
 * /api/events/delete/{id}:
 *   get:
 *     summary: Eliminar evento por ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Evento eliminado
 */
router.get("/delete/:id", authenticateJWT, eventController.deleteEvent);

/**
 * @swagger
 * /api/events/update/{id}:
 *   post:
 *     summary: Actualizar evento por query params
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
 *         description: Evento actualizado
 */
router.post("/update/:id", authenticateJWT, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a buscar
 *     responses:
 *       200:
 *         description: Detalles completos del evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *             example:
 *               _id: "680c07167e835634218013f8"
 *               name: "Concierto de Rock"
 *               description: "Evento musical en vivo"
 *               date: "2024-12-31T20:00:00.000Z"
 *               locations: ["67c25101b3f3867b9b0908ec"]
 *               organizer_id: "680c000cf534f14f7dd72d93"
 *               participants: []
 *               status: "active"
 *               category: "Música"
 *               price: 50
 *               createdAt: "2024-05-10T09:00:00.000Z"
 *               updatedAt: "2024-05-10T09:00:00.000Z"
 *       404:
 *         description: Evento no encontrado
 *       400:
 *         description: ID inválido
 */
router.get("/:id", eventController.getEventById);

/**
 * @swagger
 * /api/events/{eventId}/transactions:
 *   get:
 *     summary: Crear una nueva transacción para un evento
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: 
 *           type: string
 *         description: ID del evento
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               payment_url: "https://checkout.stripe.com/pay/pi_1J..."
 *               client_secret: "pi_1J..._secret_XYZ..."
 *               amount: 99.99
 *               currency: "eur"
 *               transaction_id: "665f4d8e1b3f3867b9b0912a"
 *       400:
 *         description: Error en los parámetros de entrada
 *       404:
 *         description: Recurso no encontrado (evento/usuario)
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:eventId/transactions", authenticateJWT, eventController.createTransaction);

module.exports = router;