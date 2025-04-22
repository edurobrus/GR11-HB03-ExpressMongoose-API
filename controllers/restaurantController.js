const Location = require('../models/Location'); // Cambiar el modelo

// GET /api/restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const restaurants = await Location.find({ type: "RESTAURANT" }).limit(limit); // Filtro añadido
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los restaurantes' });
  }
};

// GET /api/restaurants/:id
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Location.findOne({ 
      _id: req.params.id,
      type: "RESTAURANT" // Filtro combinado
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el restaurante", error });
  }
};

// POST /api/restaurants
exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Location({
      ...req.body,
      type: "RESTAURANT" // Forzar el tipo
    });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el restaurante' });
  }
};

// PUT /api/restaurants/:id
exports.updateRestaurant = async (req, res) => {
  try {
    delete req.body.type; // Prevenir cambio de tipo
    
    const updatedRestaurant = await Location.findOneAndUpdate(
      { 
        _id: req.params.id,
        type: "RESTAURANT" // Filtro combinado
      },
      req.body,
      { new: true }
    );
    
    if (!updatedRestaurant) return res.status(404).json({ error: 'Restaurante no encontrado' });
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el restaurante' });
  }
};

// DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Location.findOneAndDelete({ 
      _id: req.params.id,
      type: "RESTAURANT" // Filtro combinado
    });
    
    if (!deletedRestaurant) return res.status(404).json({ error: 'Restaurante no encontrado' });
    res.json({ message: 'Restaurante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el restaurante' });
  }
};

// GET /api/restaurants/nearby
exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridos' });
    }
    
    const distance = maxDistance ? parseInt(maxDistance, 10) : 5000;
    
    const nearbyRestaurants = await Location.find({
      type: "RESTAURANT", // Filtro añadido
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