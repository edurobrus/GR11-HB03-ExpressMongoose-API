// controllers/citieController.js
const Location = require('../models/location');
const mongoose = require("mongoose");

exports.getCities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cities = await Location.find({ type: "CITY" }).limit(limit);
        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Failed to fetch cities' });
    }
};

exports.getNearbyCities = async (req, res) => {
    try {
        const { lng, lat, maxDistance = 50000 } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: 'Longitude and latitude are required' });
        }

        const cities = await Location.find({
            type: "CITY",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(maxDistance)
                }
            }
        });
        
        res.json(cities);
    } catch (error) {
        console.error('Error fetching nearby cities:', error);
        res.status(500).json({ message: 'Failed to fetch nearby cities' });
    }
};

exports.getCityById = async (req, res) => {
    const cityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
        return res.status(400).json({ message: 'Invalid city ID' });
    }

    try {
        const location = await Location.findOne({ 
            _id: cityId, 
            type: "CITY" 
        });
        if (!location) return res.status(404).json({ message: 'City not found' });
        res.json(location);
    } catch (error) {
        console.error('Error fetching city by ID:', error);
        res.status(500).json({ message: 'Failed to fetch city by ID' });
    }
};
