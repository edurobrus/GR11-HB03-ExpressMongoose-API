const Restaurant = require('../models/Restaurant');

// GET /api/restaurants - Obtiene todos los restaurantes
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los restaurantes' });
  }
};

// GET /api/restaurants/:id - Obtiene un restaurante por ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante no encontrado' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el restaurante' });
  }
};

// POST /api/restaurants - Crea un nuevo restaurante
exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el restaurante' });
  }
};

// PUT /api/restaurants/:id - Actualiza un restaurante por ID
exports.updateRestaurant = async (req, res) => {
  try {
    const updateRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateRestaurant) return res.status(404).json({ error: 'Restaurante no encontrado' });
    res.json(updateRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el restaurante' });
  }
};

// DELETE /api/restaurants/:id - Elimina un restaurante por ID
exports.deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) return res.status(404).json({ error: 'Restaurante no encontrado' });
    res.json({ message: 'Restaurante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el restaurante' });
  }
};
