const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints for user management
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the user's profile
 *     description: >
 *       The user ID is automatically obtained from the provided JWT token.
 *       There's no need to send it explicitly as a parameter.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile successfully obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: objectid
 *                   example: "664d20a254cc8d3b40e720c0"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john.doe@example.com"
 *                 age:
 *                   type: integer
 *                   example: 25
 *                 preferences:
 *                   type: object
 *                   properties:
 *                     theme:
 *                       type: string
 *                       example: "auto"
 *                     language:
 *                       type: string
 *                       example: "en"
 *                     notifications:
 *                       type: string
 *                       example: "enabled"
 *       401:
 *         description: Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', authenticateJWT, userController.getProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update the user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: New username
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         description: New password
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *         description: New age
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: New email
 *       - in: query
 *         name: preferences.theme
 *         schema:
 *           type: string
 *         description: Preferred theme (e.g., auto)
 *       - in: query
 *         name: preferences.language
 *         schema:
 *           type: string
 *         description: Preferred language (e.g., en)
 *       - in: query
 *         name: preferences.notifications
 *         schema:
 *           type: string
 *         description: Notification settings (e.g., enabled)
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     email:
 *                       type: string
 *                       format: email
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         theme:
 *                           type: string
 *                         language:
 *                           type: string
 *                         notifications:
 *                           type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */
router.put('/me', authenticateJWT, userController.updateUser);

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Endpoints for friend management
 */


/**
 * @swagger
 * /api/users/me/friends:
 *   get:
 *     summary: Get the user's friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends (only id, username, and email)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the friend
 *                   username:
 *                     type: string
 *                     description: The username of the friend
 *                   email:
 *                     type: string
 *                     description: The email address of the friend
 *       500:
 *         description: Error fetching friends
 */
router.get('/me/friends', authenticateJWT, userController.getFriends);


/**
 * @swagger
 * /api/users/me/friends/{id}:
 *   post:
 *     summary: Add a new friend to the user's friend list
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to add as a friend
 *     responses:
 *       200:
 *         description: Friend added successfully
 *       400:
 *         description: Friend already added or invalid request
 *       404:
 *         description: Friend not found
 *       500:
 *         description: Error adding friend
 */
router.post('/me/friends/:id', authenticateJWT, userController.addFriend);

/**
 * @swagger
 * /api/users/me/friends/{id}:
 *   delete:
 *     summary: Remove a friend from the user's friend list
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the friend to remove
 *     responses:
 *       200:
 *         description: Friend removed successfully
 *       404:
 *         description: Friend not found
 *       500:
 *         description: Error removing friend
 */
router.delete('/me/friends/:id', authenticateJWT, userController.removeFriend);

module.exports = router;
