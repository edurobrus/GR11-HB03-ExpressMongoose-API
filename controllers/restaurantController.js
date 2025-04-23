const Location = require('../models/location');

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
  try {
    const restaurant = await Location.findOne({ 
      _id: req.params.id,
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

exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Location({
      ...req.body,
      type: "RESTAURANT"
    });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error creating restaurant' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    delete req.body.type; 
    
    const updatedRestaurant = await Location.findOneAndUpdate(
      { 
        _id: req.params.id,
        type: "RESTAURANT" 
      },
      req.body,
      { new: true }
    );
    
    if (!updatedRestaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error updating restaurant' });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Location.findOneAndDelete({ 
      _id: req.params.id,
      type: "RESTAURANT"
    });
    
    if (!deletedRestaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ message: 'Restaurant successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting restaurant' });
  }
};