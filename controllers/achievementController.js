// controllers/achievementController.js
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const mongoose = require("mongoose");

exports.getAchievements = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const achievements = await Achievement.find().limit(limit);
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyAchievements = async (req, res) => {
    try {
        const userId = req.userId;
        const userAchievements = await UserAchievement.find({ user_id: userId })
            .populate('achievement_id');

        const achievements = userAchievements.map(ua => ({
            ...ua.achievement_id.toObject(),
            obtained_date: ua.obtained_date
        }));

        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAchievementById = async (req, res) => {

    const achievementId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(achievementId)) {
        return res.status(400).json({ message: 'Invalid achievement ID' });
    }

    try {
        const achievement = await Achievement.findById(achievementId);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
