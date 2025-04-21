const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    amount: Number,
    date: Date,
    payment_method_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
    status: String,
    stripe_payment_intent_id: String
});

module.exports = mongoose.model('Transaction', transactionSchema);