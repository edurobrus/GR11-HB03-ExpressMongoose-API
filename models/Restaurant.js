const mongoose = require('mongoose');
const User = require('./User');  // Asegúrate de importar el modelo User si es necesario

// Esquema de Restaurante
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: false },
  country_code: { type: Number, required: false },
  city: { type: String, required: false },
  address: { type: String, required: false },
  locality: { type: String, required: false },
  locality_verbose: { type: String, required: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  cuisines: { type: String, required: false },
  average_cost_for_two: { type: Number, required: false },
  currency: { type: String, required: false },
  has_table_booking: { type: Boolean, required: false },
  has_online_delivery: { type: Boolean, required: false },
  is_delivering_now: { type: Boolean, required: false },
  switch_to_order_menu: { type: Boolean, required: false },
  price_range: { type: Number, required: false },
  aggregate_rating: { type: Number, required: false },
  rating_color: { type: String, required: false },
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Aquí guardas la referencia al User
      rating: { type: Number, required: true },
      rating_text: { type: String, required: false },
      date: { type: Date, default: Date.now },
    },
  ],
  
  country_code: { type: Number, required: false },
});

// Crear índice geoespacial para búsquedas por proximidad
restaurantSchema.index({ location: '2dsphere' });

// Crear el modelo de Restaurante
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
