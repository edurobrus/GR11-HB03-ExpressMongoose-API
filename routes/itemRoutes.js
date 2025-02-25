const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Endpoints para la gestión de ítems
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtener todos los ítems
 *     tags: [Items]
 *     description: Retorna una lista de ítems de la base de datos.
 *     responses:
 *       200:
 *         description: Lista de ítems obtenida correctamente.
 */
router.get("/", itemController.getItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtener un ítem por ID
 *     tags: [Items]
 *     description: Retorna un ítem específico de la base de datos por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a obtener
 *     responses:
 *       200:
 *         description: Ítem encontrado exitosamente.
 *       404:
 *         description: Ítem no encontrado.
 */
router.get("/:id", itemController.getItemById);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Crear un nuevo ítem
 *     tags: [Items]
 *     description: Agrega un nuevo ítem a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nuevo Item"
 *     responses:
 *       201:
 *         description: Ítem creado correctamente.
 *       400:
 *         description: Datos inválidos proporcionados.
 */
router.post("/", itemController.createItem);

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Actualizar un ítem
 *     tags: [Items]
 *     description: Modifica un ítem existente en la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ítem actualizado"
 *     responses:
 *       200:
 *         description: Ítem actualizado correctamente.
 *       404:
 *         description: Ítem no encontrado.
 */
router.put("/:id", itemController.updateItem);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Eliminar un ítem
 *     tags: [Items]
 *     description: Borra un ítem de la base de datos por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a eliminar
 *     responses:
 *       200:
 *         description: Ítem eliminado correctamente.
 *       404:
 *         description: Ítem no encontrado.
 */
router.delete("/:id", itemController.deleteItem);

module.exports = router;
