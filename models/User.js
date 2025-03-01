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
    },
    cities: [{
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Citie'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        rating_text: String
    }],
    restaurants: [{
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        rating_text: String
    }]
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;