const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    text: String,
    date: Date,
    rating: Number
});

module.exports = mongoose.model('Comment', commentSchema);