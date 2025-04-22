const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/cbd')
  .then(() => {
    console.log('Conectado a MongoDB');
    assignFriends(2);
  })
  .catch(console.error);

async function assignFriends(numFriends = 2) {
  try {
    const users = await User.find();

    for (const user of users) {
      // Solo amigos que no sean él mismo ni duplicados
      const others = users.filter(u =>
        !u._id.equals(user._id) &&
        !user.friends.includes(u._id)
      );

      const shuffled = others.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numFriends);

      for (const friend of selected) {
        if (!user.friends.includes(friend._id)) {
          user.friends.push(friend._id); // 👈 CORRECTO
        }

        if (!friend.friends.includes(user._id)) {
          friend.friends.push(user._id); // 👈 CORRECTO
          await friend.save();
        }
      }

      await user.save();
    }

    console.log('Amistades asignadas correctamente.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}