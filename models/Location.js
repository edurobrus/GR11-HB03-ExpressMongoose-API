const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
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

locationSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);

