// encrypt-passwords.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const MONGO_URI = 'mongodb://localhost:27017/cbd';
const JWT_SECRET = process.env.JWT_SECRET; // Solo lo usas para firmar/verificar JWTs

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  age: Number,
  email: String,
  events: [mongoose.Schema.Types.ObjectId],
  friends: [mongoose.Schema.Types.ObjectId],
  preferences: { type: Map, of: String }
});

const User = mongoose.model('User', userSchema);

async function encryptPasswords() {
  try {
    const users = await User.find();
    const originalPasswords = [];

    for (const user of users) {
      if (!user.password.startsWith('$2a$')) {
        originalPasswords.push({ username: user.username, password: user.password });
        const hashed = await bcrypt.hash(user.password, 10);
        user.password = hashed;
        await user.save();
        console.log(`🔐 Contraseña cifrada para: ${user.username}`);
      } else {
        console.log(`✅ Ya cifrada: ${user.username}`);
      }
    }

    // Guardar copia de usuarios y contraseñas en texto plano
    fs.writeFileSync('plain_passwords.json', JSON.stringify(originalPasswords, null, 2));
    console.log('📁 Contraseñas en texto plano guardadas en plain_passwords.json');
    console.log('🚀 Todas las contraseñas han sido procesadas');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

encryptPasswords();