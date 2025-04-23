// controllers/achievementController.js
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

exports.getAchievements = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const achievements = await Achievement.find().limit(limit);
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAchievementsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userAchievements = await UserAchievement.find({ user_id: userId })
            .populate('achievement_id');

        if (userAchievements.length === 0) {
            return res.status(404).json({ message: 'Not achievements found for this user' });
        }

        const achievements = userAchievements.map(ua => ({
            ...ua.achievement_id.toObject(),
            obtained_date: ua.obtained_date
        }));

        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

