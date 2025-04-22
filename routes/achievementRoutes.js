const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");

/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: Endpoints para la gestión de logros
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único generado por MongoDB
 *         name:
 *           type: string
 *           description: Nombre del logro
 *         description:
 *           type: string
 *           description: Descripción del logro
 *         requirements:
 *           type: object
 *           additionalProperties:
 *             type: string
 *       example:
 *         _id: "661feaf8bc3e2a9c1234abcd"
 *         name: "Primer Evento"
 *         description: "Asiste a tu primer evento"
 *         requirements:
 *           attendedEvents: ">=1"
 */

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Obtener todos los logros
 *     tags: [Achievements]
 *     responses:
 *       200:
 *         description: Lista de logros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 */
router.get("/", achievementController.getAchievements);

/**
 * @swagger
 * /api/achievements/getById/{id}:
 *   get:
 *     summary: Obtener logro por ID
 *     tags: [Achievements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Logro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       404:
 *         description: Logro no encontrado
 */
router.get("/getById/:id", achievementController.getAchievementById);

/**
 * @swagger
 * /api/achievements/user/{userId}:
 *   get:
 *     summary: Obtener todos los logros de un usuario
 *     tags: [Achievements]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de logros obtenidos por el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 *       404:
 *         description: El usuario no tiene logros
 */
router.get("/user/:userId", achievementController.getAchievementsByUserId);

module.exports = router;
