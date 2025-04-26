// controllers/messageController.js
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const WebSocket = require('ws');

function sendWsMessage(clients, event, data) {
  const message = JSON.stringify({ event, data });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

exports.createMessage = async (req, res) => {
    const { receiver_id, content } = req.query;
    const userId = req.userId;

    if (!receiver_id || !content) {
        return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver_id)) {
        return res.status(400).json({ error: 'Invalid receiver ID' });
    }

    if (receiver_id === userId) {
        return res.status(400).json({ error: 'You cannot send a message to yourself' });
    }

    try {
        const [receiver, sender] = await Promise.all([
            User.findById(receiver_id),
            User.findById(userId, 'username avatar') // Solo username y avatar del sender
        ]);
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver user not found' });
        }

        const message = new Message({
            sender_id: userId,
            receiver_id,
            content,
            date: new Date(),
            status: 'sent'
        });

        
        sendWsMessage(req.app.locals.wsClients, 'message:new', {
            ...message.toObject(),
            sender: sender.toObject()
        });

        await message.save();
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: 'Error saving message', details: err.message });
    }
};


exports.getSentMessages = async (req, res) => {
    const userId = req.userId;

    try {
        const messages = await Message.find({ sender_id: userId }).sort({ date: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching sent messages', details: err.message });
    }
};

exports.getReceivedMessages = async (req, res) => {
    const userId = req.userId;

    try {
        const messages = await Message.find({ receiver_id: userId }).sort({ date: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching received messages', details: err.message });
    }
};

exports.updateMessageStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid message ID' });
    }

    try {
        const message = await Message.findOne({ _id: id, sender_id: userId });

        if (!message) {
            return res.status(404).json({ error: 'Message not found or not authorized to update it' });
        }

        message.status = status;
        await message.save();

        res.json(message);
    } catch (err) {
        res.status(500).json({ error: 'Error updating message status', details: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid message ID' });
    }

    try {
        const message = await Message.findOneAndDelete({ _id: id, sender_id: userId });

        if (!message) {
            return res.status(404).json({ error: 'Message not found or you are not authorized to delete it' });
        }

        res.json({ message: 'Message successfully deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting message', details: err.message });
    }
};

