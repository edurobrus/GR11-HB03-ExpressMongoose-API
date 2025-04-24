// controllers/restaurantController.js
const Location = require('../models/location');
const mongoose = require("mongoose");

exports.getRestaurants = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const restaurants = await Location.find({ type: "RESTAURANT" }).limit(limit);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
};

exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const distance = maxDistance ? parseInt(maxDistance, 10) : 5000;
    
    const nearbyRestaurants = await Location.find({
      type: "RESTAURANT",
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
    res.status(500).json({ error: 'Error fetching nearby restaurants' });
  }
};

exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid restaurant ID' });
  }

  try {
    const restaurant = await Location.findOne({ 
      _id: id,
      type: "RESTAURANT"
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
  }
};
