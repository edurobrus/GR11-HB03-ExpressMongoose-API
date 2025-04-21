const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    name: String,
    description: String,
    requirements: { type: Map, of: String }
});

module.exports = mongoose.model('Achievement', achievementSchema);