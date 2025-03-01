// controllers/citieController.js
const Citie = require('../models/Citie');

exports.getCities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cities = await Citie.find().limit(limit);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCitieById = async (req, res) => {
    try {
        const citie = await Citie.findById(req.params.id);
        if (!citie) return res.status(404).json({ message: 'Ciudad no encontrada' });
        res.json(citie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCitie = async (req, res) => {
    try {
        const newCitie = new Citie(req.body);
        const savedCitie = await newCitie.save();
        res.status(201).json(savedCitie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCitie = async (req, res) => {
    try {
        const updatedCitie = await Citie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCitie) return res.status(404).json({ message: 'Ciudad no encontrada' });
        res.json(updatedCitie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCitie = async (req, res) => {
    try {
        const deletedCitie = await Citie.findByIdAndDelete(req.params.id);
        if (!deletedCitie) return res.status(404).json({ message: 'Ciudad no encontrada' });
        res.json({ message: 'Ciudad eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNearbyCities = async (req, res) => {
    try {
        const { lng, lat, maxDistance = 50000 } = req.query;
        
        const cities = await Citie.find({
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