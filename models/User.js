const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    email: String,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    preferences: { type: Map, of: String }
});

module.exports = mongoose.model('User', userSchema);