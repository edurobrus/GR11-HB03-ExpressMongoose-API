const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    stripe_payment_intent_id: { type: String }
});

module.exports = mongoose.model('Transaction', transactionSchema);