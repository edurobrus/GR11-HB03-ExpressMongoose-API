const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Endpoints for message management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the message
 *         sender_id:
 *           type: string
 *           description: ID of the sender user
 *         receiver_id:
 *           type: string
 *           description: ID of the receiver user
 *         content:
 *           type: string
 *           description: Text content of the message
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time the message was sent
 *         status:
 *           type: string
 *           description: Status of the message (e.g., sent, read)
 *       example:
 *         _id: "661c12fcfe098f76e45b1234"
 *         sender_id: "661bffef6f4b18cfdfd12345"
 *         receiver_id: "661bfff26f4b18cfdfd67890"
 *         content: "Hello, how are you?"
 *         date: "2025-04-23T15:30:00Z"
 *         status: "sent"
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: receiver_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user receiving the message
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: true
 *         description: The text content of the message
 *     responses:
 *       200:
 *         description: Message created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateJWT, messageController.createMessage);

/**
 * @swagger
 * /api/messages/sent:
 *   get:
 *     summary: Get all messages sent by the user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages sent by the user
 *       404:
 *         description: No messages found
 *       500:
 *         description: Server error
 */
router.get('/sent', authenticateJWT, messageController.getSentMessages);

/**
 * @swagger
 * /api/messages/received:
 *   get:
 *     summary: Get all messages received by the user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages received by the user
 *       404:
 *         description: No messages found
 *       500:
 *         description: Server error
 */
router.get('/received', authenticateJWT, messageController.getReceivedMessages);

/**
 * @swagger
 * /api/messages/status/{id}:
 *   patch:
 *     summary: Update the status of a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to update
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: New status of the message (e.g., read, sent)
 *     responses:
 *       200:
 *         description: Message status updated
 *       400:
 *         description: Invalid status or ID
 *       404:
 *         description: Message not found
 */
router.patch('/status/:id', authenticateJWT, messageController.updateMessageStatus);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message successfully deleted
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateJWT, messageController.deleteMessage);

module.exports = router;
