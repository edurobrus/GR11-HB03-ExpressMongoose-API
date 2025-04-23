// controllers/userController.js
const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { username, password, age, email } = req.body;
        const user = new User({ username, password, age, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, password, age, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, password, age, email },
            { new: true, fields: 'username password age email' }
        );
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

