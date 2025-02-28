const mongoose = require('mongoose');

// Esquema del Usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Nombre de usuario único
  rating: { type: Number, required: true }, // Calificación del usuario
  date: { type: Date, default: Date.now }, // Fecha del voto
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
