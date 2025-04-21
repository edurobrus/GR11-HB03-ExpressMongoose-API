const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: String,
    category: String,
    price: Number
});

module.exports = mongoose.model('Event', eventSchema);