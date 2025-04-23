// controllers/messageController.js
const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;

        const message = new Message({
            sender_id,
            receiver_id,
            content,
            date: new Date(),
            status: 'sent'
        });

        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getSentMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.find({ sender_id: userId }).sort({ date: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReceivedMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.find({ receiver_id: userId }).sort({ date: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateMessageStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const message = await Message.findByIdAndUpdate(id, { status }, { new: true });
        if (!message) return res.status(404).json({ error: 'Message not found' });
        res.json(message);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Message.findByIdAndDelete(id);
        if (!message) return res.status(404).json({ error: 'Message not found' });
        res.json({ message: 'Message successfully deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
