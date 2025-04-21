const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    preferences: { type: Map, of: String }
});

module.exports = mongoose.model('User', usuarioSchema);