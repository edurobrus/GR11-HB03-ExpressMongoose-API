const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: false },
  country_code: { type: Number, required: false },
  city: { type: String, required: false },
  address: { type: String, required: false },
  locality: { type: String, required: false },
  locality_verbose: { type: String, required: false },
  longitude: { type: Number, required: false },
  latitude: { type: Number, required: false },
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
  rating_text: { type: String, required: false }, 
  votes: { type: Number, required: false }, 
});

module.exports = mongoose.model("Restaurant", restaurantSchema);