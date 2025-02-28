const Restaurant = require('../models/Restaurant');

// GET /api/restaurants - Obtiene restaurantes con límite opcional pasado por la URL
exports.getRestaurants = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // Si no se especifica, se usa 10 por defecto
    const restaurants = await Restaurant.find().limit(limit);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los restaurantes' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el restaurante", error });
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

// GET /api/restaurants/nearby?lat=XX&lng=YY&maxDistance=ZZ
exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridos' });
    }
    
    const distance = maxDistance ? parseInt(maxDistance, 10) : 5000; // 5km por defecto
    
    const nearbyRestaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: distance,
        },
      },
    });
    
    res.json(nearbyRestaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener restaurantes cercanos' });
  }
};