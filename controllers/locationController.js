const mongoose = require('mongoose');
const Location = require('../models/location');

exports.getLocations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const locations = await Location.find().limit(limit);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching locations' });
  }
};


exports.getNearbyLocations = async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const distance = maxDistance ? parseInt(maxDistance, 10) : 5000;

    const nearbyLocations = await Location.find({
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

    res.json(nearbyLocations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching nearby locations' });
  }
};

exports.getTopRatedLocations = async (req, res) => {
  try {
    const topRatedLocations = await Location.find()
      .sort({ avg_rating: -1 })
      .limit(5); 

    res.json(topRatedLocations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching top-rated locations' });
  }
};

exports.getMostVotedLocations = async (req, res) => {
  try {
    const mostVotedLocations = await Location.find()
      .sort({ total_ratings: -1 })
      .limit(5);

    res.json(mostVotedLocations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching most voted locations' });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: "Error fetching location", error });
  }
};

exports.updateLocationRating = async (req, res) => {
  const { id } = req.params;
  const { avg_user } = req.body;

  const parsedRating = parseFloat(avg_user);

  if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
    return res.status(400).json({ error: 'avg_user must be a number between 0 and 5' });
  }

  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { avg_rating, total_ratings } = location;
    const new_total_ratings = total_ratings + 1;
    const new_avg_rating = ((avg_rating * total_ratings) + parsedRating) / new_total_ratings;

    location.avg_rating = new_avg_rating;
    location.total_ratings = new_total_ratings;

    await location.save();

    res.status(200).json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};