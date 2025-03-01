const mongoose = require('mongoose');

const citieSchema = new mongoose.Schema({
    city_name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

citieSchema.index({ location: '2dsphere' });

const Citie = mongoose.model('Citie', citieSchema);

module.exports = Citie;