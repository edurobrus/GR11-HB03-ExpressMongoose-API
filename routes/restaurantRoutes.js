const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Endpoints para la gestión de restaurantes, incluyendo operaciones CRUD.
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
 *         country_code:
 *           type: number
 *           description: Código de país.
 *         city:
 *           type: string
 *           description: Ciudad donde se ubica el restaurante.
 *         address:
 *           type: string
 *           description: Dirección del restaurante.
 *         locality:
 *           type: string
 *           description: Localidad del restaurante.
 *         locality_verbose:
 *           type: string
 *           description: Descripción detallada de la localidad.
 *         longitude:
 *           type: number
 *           description: Coordenada de longitud.
 *         latitude:
 *           type: number
 *           description: Coordenada de latitud.
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
 *         is_delivering_now:
 *           type: boolean
 *           description: Indica si el restaurante está entregando en este momento.
 *         switch_to_order_menu:
 *           type: boolean
 *           description: Indica si el restaurante permite cambiar al menú de pedidos.
 *         price_range:
 *           type: number
 *           description: Rango de precios del restaurante.
 *         aggregate_rating:
 *           type: number
 *           description: Calificación agregada del restaurante.
 *         rating_color:
 *           type: string
 *           description: Color asociado a la calificación.
 *         rating_text:
 *           type: string
 *           description: Texto descriptivo de la calificación.
 *         votes:
 *           type: number
 *           description: Número de votos recibidos.
 *       example:
 *         _id: 60c72b2f9b1e8a001c8e4d2a
 *         name: "Le Petit Souffle"
 *         country_code: 162
 *         city: "Makati City"
 *         address: "Third Floor, Century City Mall, Kalayaan Avenue, Poblacion"
 *         locality: "Century City Mall, Poblacion, Makati City"
 *         locality_verbose: "Century City Mall, Poblacion, Makati City, Makati City"
 *         longitude: 121.027535
 *         latitude: 14.565443
 *         cuisines: "French, Japanese, Desserts"
 *         average_cost_for_two: 1100
 *         currency: "Botswana Pula(P)"
 *         has_table_booking: true
 *         has_online_delivery: false
 *         is_delivering_now: false
 *         switch_to_order_menu: false
 *         price_range: 3
 *         aggregate_rating: 4.8
 *         rating_color: "Dark Green"
 *         rating_text: "Excellent"
 *         votes: 314
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurants]
 *     description: Retorna una lista con todos los restaurantes almacenados en la base de datos. Se puede especificar un límite mediante el parámetro query 'limit'.
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
 * /api/restaurants/{id}:
 *   get:
 *     summary: Obtener un restaurante por ID
 *     tags: [Restaurants]
 *     description: Obtiene un restaurante específico de la base de datos a partir de su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante.
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
router.get("/:id", restaurantController.getRestaurantById);

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Crear un nuevo restaurante
 *     tags: [Restaurants]
 *     description: Agrega un nuevo restaurante a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurante creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       500:
 *         description: Error al crear el restaurante.
 */
router.post("/", restaurantController.createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Actualizar un restaurante
 *     tags: [Restaurants]
 *     description: Modifica un restaurante existente en la base de datos mediante su ID.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurante no encontrado.
 *       500:
 *         description: Error al actualizar el restaurante.
 */
router.put("/:id", restaurantController.updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Eliminar un restaurante
 *     tags: [Restaurants]
 *     description: Elimina un restaurante de la base de datos utilizando su ID.
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
 *       500:
 *         description: Error al eliminar el restaurante.
 */
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
