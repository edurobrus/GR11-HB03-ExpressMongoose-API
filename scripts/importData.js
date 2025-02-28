const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const iconv = require('iconv-lite');
const dotenv = require('dotenv');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const connectDB = require('../config/db');

dotenv.config();

// Función para crear usuarios sin encriptación de contraseñas
const createUsersFromCSV = async (csvFilePath) => {
  const users = [];
  const existingUsernames = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(csvParser({ strict: true, mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        const username = row['username']?.trim();
        const password = row['password']?.trim();
        const latitude = parseFloat(row['latitude']);
        const longitude = parseFloat(row['longitude']);

        if (!username || existingUsernames.has(username)) {
          console.warn(`⚠️ Usuario inválido o duplicado: ${username}`);
          return;
        }
        if (!password) {
          console.warn(`⚠️ Fila sin contraseña para: ${username}`);
          return;
        }
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`⚠️ Coordenadas inválidas para: ${username}`);
          return;
        }

        existingUsernames.add(username);

        users.push({
          username,
          password, // Se almacena sin encriptación
          location: {
            type: 'Point',
            coordinates: [longitude, latitude] // MongoDB espera [longitud, latitud]
          }
        });
      })
      .on('end', async () => {
        if (users.length === 0) return reject('❌ No hay usuarios válidos.');

        try {
          const createdUsers = await User.insertMany(users);
          resolve(createdUsers);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
};

// Función principal de importación
const startImport = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await connectDB();
    console.log('✅ Conexión a MongoDB establecida');

    // Rutas de archivos (asegúrate de que UserTotal.csv contenga username, password, latitude, longitude)
    const userCSV = path.join(__dirname, '../data/User.csv');
    const restaurantCSV = path.join(__dirname, '../data/Restaurant.csv');

    // Limpiar colecciones existentes
    console.log('🧹 Eliminando documentos existentes...');
    await Promise.all([Restaurant.deleteMany({}), User.deleteMany({})]);
    console.log('✅ Colecciones vaciadas.');

    // Crear usuarios con su ubicación
    console.log('👥 Creando usuarios...');
    const users = await createUsersFromCSV(userCSV);
    console.log(`✅ ${users.length} usuarios creados.`);

    // Procesar restaurantes (sin cambios respecto a antes)
    const restaurants = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(restaurantCSV)
        .pipe(iconv.decodeStream('utf8'))
        .pipe(csvParser({ mapHeaders: ({ header }) => header.trim() }))
        .on('data', (row) => {
          try {
            const longitude = parseFloat(row['Longitude']);
            const latitude = parseFloat(row['Latitude']);
            
            if (isNaN(longitude) || isNaN(latitude)) {
              console.warn(`⚠️ Coordenadas inválidas en: ${row['Restaurant Name']}`);
              return;
            }
            
            const votesCount = parseInt(row['Votes']) || 0;
            const restaurantVotes = [];
            let userIndex = 0;
            for (let i = 0; i < votesCount; i++) {
              const selectedUser = users[userIndex];
              restaurantVotes.push({
                user: selectedUser._id,
                rating: parseFloat(row['Aggregate rating']) || 0,
                rating_text: row['Rating text'] || 'Sin calificación'
              });
              userIndex = (userIndex + 1) % users.length;
            }
            
            restaurants.push({
              name: row['Restaurant Name'] || 'Sin nombre',
              address: row['Address'] || 'Sin dirección',
              city: row['City'] || 'Desconocido',
              locality: row['Locality'] || 'Desconocido',
              location: {
                type: 'Point',
                coordinates: [longitude, latitude]
              },
              cuisines: row['Cuisines']?.split(',').map(c => c.trim()).join(', ') || 'Desconocido',
              average_cost_for_two: Number(row['Average Cost for two']) || 0,
              currency: row['Currency'] || 'N/A',
              has_table_booking: row['Has Table booking'] === 'Yes',
              has_online_delivery: row['Has Online delivery'] === 'Yes',
              price_range: Number(row['Price range']) || 0,
              aggregate_rating: parseFloat(row['Aggregate rating']) || 0,
              rating_text: row['Rating text'] || 'Sin calificación',
              votes: restaurantVotes,
            });
          } catch (error) {
            console.error('❌ Error procesando fila:', error);
          }
        })
        .on('end', async () => {
          try {
            if (restaurants.length === 0) {
              console.warn('⚠️ No hay datos válidos para importar.');
            } else {
              await Restaurant.insertMany(restaurants);
              console.log(`✅ ${restaurants.length} restaurantes importados.`);
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });

  } catch (error) {
    console.error('❌ Error en importación:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔒 Conexión cerrada');
  }
};

console.log('🚀 Iniciando importación...');
startImport().catch(error => {
  console.error('💣 Error crítico:', error);
  process.exit(1);
});
