const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Endpoints para la gestión de restaurantes, incluyendo operaciones CRUD y búsqueda por proximidad.
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
 *           description: ID único del restaurante generado por MongoDB.
 *         name:
 *           type: string
 *           description: Nombre del restaurante.
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: ['Point']
 *               description: Tipo de dato geoespacial.
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Coordenadas geográficas [longitud, latitud].
 *         country_code:
 *           type: number
 *           description: Código de país.
 *         city:
 *           type: string
 *           description: Ciudad donde se ubica el restaurante.
 *         address:
 *           type: string
 *           description: Dirección del restaurante.
 *         cuisines:
 *           type: string
 *           description: Tipos de cocina ofrecidos.
 *         average_cost_for_two:
 *           type: number
 *           description: Costo promedio para dos personas.
 *         currency:
 *           type: string
 *           description: Moneda utilizada.
 *         has_table_booking:
 *           type: boolean
 *           description: Indica si el restaurante permite reservas de mesa.
 *         has_online_delivery:
 *           type: boolean
 *           description: Indica si el restaurante ofrece entrega en línea.
 *         aggregate_rating:
 *           type: number
 *           description: Calificación agregada del restaurante.
 *         votes:
 *           type: number
 *           description: Número de votos recibidos.
 *       example:
 *         _id: "60c72b2f9b1e8a001c8e4d2a"
 *         name: "Le Petit Souffle"
 *         location:
 *           type: "Point"
 *           coordinates: [121.027535, 14.565443]
 *         country_code: 162
 *         city: "Makati City"
 *         address: "Third Floor, Century City Mall, Kalayaan Avenue, Poblacion"
 *         cuisines: "French, Japanese, Desserts"
 *         average_cost_for_two: 1100
 *         currency: "PHP"
 *         has_table_booking: true
 *         has_online_delivery: false
 *         aggregate_rating: 4.8
 *         votes: 314
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: "Número máximo de restaurantes a retornar. Valor por defecto: 10."
 *     responses:
 *       200:
 *         description: Lista de restaurantes obtenida correctamente.
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
 * /api/restaurants/getById/{id}:
 *   get:
 *     summary: Obtener un restaurante por ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante a obtener.
 *     responses:
 *       200:
 *         description: Restaurante obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurante no encontrado.
 */
router.get("/getById/:id", restaurantController.getRestaurantById);



/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Crear un nuevo restaurante
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurante creado correctamente.
 *       500:
 *         description: Error al crear el restaurante.
 */
router.post("/", restaurantController.createRestaurant);

/**
 * @swagger
 * /api/restaurants/update/{id}:
 *   put:
 *     summary: Actualizar un restaurante
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurante actualizado correctamente.
 *       404:
 *         description: Restaurante no encontrado.
 */
router.put("/update/:id", restaurantController.updateRestaurant);

/**
 * @swagger
 * /api/restaurants/delete/{id}:
 *   delete:
 *     summary: Eliminar un restaurante
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante.
 *     responses:
 *       200:
 *         description: Restaurante eliminado correctamente.
 *       404:
 *         description: Restaurante no encontrado.
 */
router.delete("delete/:id", restaurantController.deleteRestaurant);

/**
 * @swagger
 * /api/restaurants/nearby:
 *   get:
 *     summary: Obtener restaurantes cercanos
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           default: 121.027535  # Ejemplo: Ciudad de México
 *         required: true
 *         description: Longitud de la ubicación del usuario.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           default: 14.565443  # Ejemplo: Ciudad de México
 *         required: true
 *         description: Latitud de la ubicación del usuario.
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 5000
 *         description: Distancia máxima en metros (por defecto 5000m).
 *     responses:
 *       200:
 *         description: Lista de restaurantes cercanos obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/nearby", restaurantController.getNearbyRestaurants);


module.exports = router;
