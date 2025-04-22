const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: {
    name: {
      type: String,
      required: true
    }
  },
  avg_rating: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['CITY', 'RESTAURANT'],
    required: true
  },
  total_ratings: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Location', locationSchema);
