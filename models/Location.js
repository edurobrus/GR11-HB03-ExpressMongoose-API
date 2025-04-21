const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['cities', 'restaurants']
    },
    name: String,
    coordinates: {
        type: Map,
        of: Number // { latitude: ..., longitude: ... }
    }
});

module.exports = mongoose.model('Location', locationSchema);