// controllers/userController.js
const mongoose = require('mongoose');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).select('_id username email age preferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      age: user.age,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ 
      message: 'Error retrieving profile:',
      error: error.message 
    });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const { username, password, age, email, 
            'preferences.theme': theme,
            'preferences.language': language,
            'preferences.notifications': notifications } = req.query;

    const updatedFields = {};
    if (username !== undefined) updatedFields.username = username;
    if (password !== undefined) updatedFields.password = password;
    if (age !== undefined) updatedFields.age = Number(age);
    if (email !== undefined) updatedFields.email = email;

    const preferences = {};
    if (theme !== undefined) preferences.theme = theme;
    if (language !== undefined) preferences.language = language;
    if (notifications !== undefined) preferences.notifications = notifications;

    if (Object.keys(preferences).length > 0) {
      updatedFields.preferences = preferences;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true, select: 'username age email preferences' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId)
      .populate('friends', 'username email');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const friendsData = user.friends.map(friend => ({
      id: friend._id,
      username: friend.username,
      email: friend.email
    }));

    res.json(friendsData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching friends', error: err.message });
  }
};


exports.addFriend = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  if (userId === id) {
    return res.status(400).json({ message: "You can't add yourself as a friend" });
  }

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid friend ID' });
    }
    
    const friend = await User.findById(id);
    if (!friend) return res.status(404).json({ message: 'Friend not found' });

    const user = await User.findById(userId);

    if (user.friends.includes(id)) {
      return res.status(400).json({ message: 'Already added as a friend' });
    }

    user.friends.push(id);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding friend', error: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid friend ID' });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(id);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    if (!user.friends.includes(id)) {
      return res.status(404).json({ message: 'Friend not found in your list' });
    }

    user.friends = user.friends.filter(id => id.toString() !== id);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing friend', error: err.message });
  }
};

