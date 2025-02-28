const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurant_name: {
        type: String,
        required: true
    },
    avg_rating: {
        type: Number,
        required: true
    },
    location: { // ✅ Campo GeoJSON
        type: {
            type: String,
            enum: ['Point'], // Solo permite 'Point'
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
});

// Índice geoespacial para consultas de proximidad
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;