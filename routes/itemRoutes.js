const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Endpoints para la gestión de ítems, incluyendo operaciones CRUD.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del ítem.
 *         name:
 *           type: string
 *           description: Nombre del ítem.
 *         description:
 *           type: string
 *           description: Descripción del ítem.
 *       example:
 *         id: 60c72b2f9b1e8a001c8e4d2a
 *         name: "Ejemplo de ítem"
 *         description: "Este es un ejemplo de ítem con descripción detallada."
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtener todos los ítems
 *     tags: [Items]
 *     description: Retorna una lista con todos los ítems almacenados en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de ítems obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/", itemController.getItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtener un ítem por ID
 *     tags: [Items]
 *     description: Obtiene un ítem específico de la base de datos a partir de su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a obtener.
 *     responses:
 *       200:
 *         description: Ítem encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
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
 *                 description: Nombre del ítem.
 *               description:
 *                 type: string
 *                 description: Descripción del ítem.
 *     responses:
 *       201:
 *         description: Ítem creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
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
 *     description: Modifica un ítem existente en la base de datos mediante su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del ítem.
 *               description:
 *                 type: string
 *                 description: Descripción del ítem.
 *     responses:
 *       200:
 *         description: Ítem actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
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
 *     description: Elimina un ítem de la base de datos utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a eliminar.
 *     responses:
 *       200:
 *         description: Ítem eliminado correctamente.
 *       404:
 *         description: Ítem no encontrado.
 */
router.delete("/:id", itemController.deleteItem);

module.exports = router;
