const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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
    },
    cities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Citie' // Referencia al modelo Citie
    }],
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant' // Referencia al modelo Restaurant
    }]
});

// Índice geoespacial para consultas de proximidad
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;