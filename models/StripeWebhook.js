const mongoose = require('mongoose');

const stripeWebhookSchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    payment_intent_id: String,
    status: String,
    date: Date,
    details: String
});

module.exports = mongoose.model('StripeWebhook', stripeWebhookSchema);