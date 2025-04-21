const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    achievement_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    obtained_date: Date
});

module.exports = mongoose.model('UserAchievement', userAchievementSchema);