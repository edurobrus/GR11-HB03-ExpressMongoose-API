const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    type: String,
    details: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stripe_customer_id: String
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);