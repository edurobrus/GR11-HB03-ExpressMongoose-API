const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/cbd')
  .then(() => {
    console.log('Conectado a MongoDB');
    addRandomPreferences();
  })
  .catch(console.error);

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function addRandomPreferences() {
  try {
    const users = await User.find();
    const total = users.length;

    const themes = ['light', 'dark', 'auto'];
    const languages = ['es', 'en', 'fr', 'de'];
    const notifications = ['enabled', 'disabled'];

    let unchangedCount = 0;

    for (let i = 0; i < total; i++) {
      const user = users[i];

      // 🔧 Inicializar preferences si no existe
      if (!user.preferences) {
        user.preferences = new Map();
      }

      const hasTheme = user.preferences.has('theme');
      const hasLanguage = user.preferences.has('language');
      const hasNotifications = user.preferences.has('notifications');

      if (hasTheme && hasLanguage && hasNotifications) {
        unchangedCount++;
      } else {
        if (!hasTheme) user.preferences.set('theme', randomChoice(themes));
        if (!hasLanguage) user.preferences.set('language', randomChoice(languages));
        if (!hasNotifications) user.preferences.set('notifications', randomChoice(notifications));
        await user.save();
      }

      console.log(`[${i + 1}/${total}] Procesado: ${user.email}`);
    }

    console.log('\nPreferencias aleatorias añadidas donde faltaban.');
    console.log(`Usuarios ya completos (no modificados): ${unchangedCount}`);
  } catch (err) {
    console.error('Error al asignar preferencias:', err);
  } finally {
    mongoose.disconnect();
  }
}