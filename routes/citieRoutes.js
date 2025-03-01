const express = require("express");
const router = express.Router();
const citieController = require("../controllers/citieController");

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: Endpoints para la gestión de ciudades
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Citie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único generado por MongoDB
 *         city_name:
 *           type: string
 *           description: Nombre de la ciudad
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: ['Point']
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example: [2.3522, 48.8566]
 *       example:
 *         _id: "60c72b2f9b1e8a001c8e4d2a"
 *         city_name: "París"
 *         location:
 *           type: "Point"
 *           coordinates: [2.3522, 48.8566]
 */

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Obtener todas las ciudades
 *     tags: [Cities]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: "Límite de resultados (default: 10)"
 *     responses:
 *       200:
 *         description: Lista de ciudades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Citie'
 */
router.get("/", citieController.getCities);

/**
 * @swagger
 * /api/cities/getById/{id}:
 *   get:
 *     summary: Obtener ciudad por ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ciudad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Citie'
 *       404:
 *         description: Ciudad no encontrada
 */
router.get("/getById/:id", citieController.getCitieById);

/**
 * @swagger
 * /api/cities/:
 *   post:
 *     summary: Crear nueva ciudad
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Citie'
 *     responses:
 *       201:
 *         description: Ciudad creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", citieController.createCitie);

/**
 * @swagger
 * /api/cities/update/{id}:
 *   put:
 *     summary: Actualizar ciudad
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Citie'
 *     responses:
 *       200:
 *         description: Ciudad actualizada
 *       404:
 *         description: Ciudad no encontrada
 */
router.put("/update/:id", citieController.updateCitie);

/**
 * @swagger
 * /api/cities/delete/{id}:
 *   delete:
 *     summary: Eliminar ciudad
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ciudad eliminada
 *       404:
 *         description: Ciudad no encontrada
 */
router.delete("/delete/:id", citieController.deleteCitie);

/**
 * @swagger
 * /api/cities/nearby:
 *   get:
 *     summary: Obtener ciudades cercanas
 *     tags: [Cities]
 *     parameters:
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         example: 2.3522
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         example: 48.8566
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 50000
 *     responses:
 *       200:
 *         description: Lista de ciudades cercanas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Citie'
 */
router.get("/nearby", citieController.getNearbyCities);

module.exports = router;