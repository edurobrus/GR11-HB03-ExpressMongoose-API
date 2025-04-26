// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
    const { username, password, age, email } = req.query;

    if (!username || !password || !email || !age) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const numericAge = parseInt(age, 10);
    if (isNaN(numericAge) || numericAge < 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const defaultPreferences = {
            theme: "auto",
            language: "en",
            notifications: "enabled"
        };

        const user = new User({
            username,
            password,
            age: numericAge,
            email,
            preferences: defaultPreferences
        });

        await user.save();

        const token = generateToken(user._id);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.query;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', { username, error });
        res.status(500).json({ message: 'Failed to log in' });
    }
};

