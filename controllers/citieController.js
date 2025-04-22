// controllers/citieController.js
const Location = require('../models/Location'); // Cambiado a Location

exports.getCities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cities = await Location.find({ type: "CITY" }).limit(limit);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCitieById = async (req, res) => {
    try {
        const location = await Location.findOne({ 
            _id: req.params.id, 
            type: "CITY" 
        });
        if (!location) return res.status(404).json({ message: 'Ciudad no encontrada' });
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCitie = async (req, res) => {
    try {
        const newLocation = new Location({
            ...req.body,
            type: "CITY" // Fuerza el tipo
        });
        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCitie = async (req, res) => {
    try {
        delete req.body.type; // Previene modificación del tipo
        
        const updatedLocation = await Location.findOneAndUpdate(
            { 
                _id: req.params.id, 
                type: "CITY" 
            },
            req.body,
            { new: true }
        );
        if (!updatedLocation) return res.status(404).json({ message: 'Ciudad no encontrada' });
        res.json(updatedLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCitie = async (req, res) => {
    try {
        const deletedLocation = await Location.findOneAndDelete({ 
            _id: req.params.id, 
            type: "CITY" 
        });
        if (!deletedLocation) return res.status(404).json({ message: 'Ciudad no encontrada' });
        res.json({ message: 'Ciudad eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNearbyCities = async (req, res) => {
    try {
        const { lng, lat, maxDistance = 50000 } = req.query;
        
        const cities = await Location.find({
            type: "CITY", // Filtro combinado
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
        res.status(500).json({ message: error.message });
    }
};