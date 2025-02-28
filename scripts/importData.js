const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const iconv = require('iconv-lite');
const dotenv = require('dotenv');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

// Función para crear usuarios en lotes
const createUsers = async (count) => {
  const users = Array.from({ length: count }, (_, i) => ({
    username: `user_${i}`,  // Usernames únicos: user_0, user_1... user_299
    rating: Math.floor(Math.random() * 5) + 1,  // Calificación aleatoria del usuario
  }));
  const createdUsers = await User.insertMany(users);
  return createdUsers;
};

// Función de importación
const startImport = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await connectDB();
    console.log('✅ Conexión a MongoDB establecida');

    // Ruta del archivo CSV
    const csvFilePath = path.join(__dirname, '../data/Restaurant.csv');

    // Limpiar colecciones existentes
    console.log('🧹 Eliminando documentos existentes...');
    await Restaurant.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Colecciones vaciadas.');

    // Paso 1: Crear 300 usuarios iniciales
    console.log('👥 Creando 300 usuarios...');
    const users = await createUsers(500);  // Crear todos los usuarios primero
    console.log(`✅ ${users.length} usuarios creados.`);

    const restaurants = [];

    // Leer el archivo CSV
    const stream = fs.createReadStream(csvFilePath)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(csvParser({ strict: true, mapHeaders: ({ header }) => header.trim() }));

    stream.on('data', (row) => {
      try {
        const longitude = parseFloat(row['Longitude']);
        const latitude = parseFloat(row['Latitude']);

        if (isNaN(longitude) || isNaN(latitude)) {
          console.warn(`⚠️ Coordenadas inválidas en: ${row['Restaurant Name']}`);
          return;
        }

        // Obtener número de votos del CSV (asegúrate de que la columna se llame 'Votes')
        const votesCount = parseInt(row['Votes']) || 0;

        // Seleccionar usuarios aleatorios para los votos
        const restaurantVotes = [];
        for (let i = 0; i < votesCount; i++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          restaurantVotes.push({
            userId: randomUser._id,
            username: randomUser.username,
            rating: randomUser.rating,  // Usar la calificación del usuario
          });
        }

        // Construir el objeto del restaurante
        const formattedRow = {
          name: row['Restaurant Name'] || 'Desconocido',
          address: row['Address'] || 'Sin dirección',
          city: row['City'] || 'Desconocido',
          locality: row['Locality'] || 'Desconocido',
          locality_verbose: row['Locality Verbose'] || 'N/A',
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          cuisines: row['Cuisines']
            ? row['Cuisines'].split(',').map((c) => c.trim()).join(', ')
            : 'Desconocido',
          average_cost_for_two: Number(row['Average Cost for two']) || 0,
          currency: row['Currency'] || 'N/A',
          has_table_booking: row['Has Table booking'] === 'Yes',
          has_online_delivery: row['Has Online delivery'] === 'Yes',
          is_delivering_now: row['Is delivering now'] === 'Yes',
          switch_to_order_menu: row['Switch to order menu'] === 'Yes',
          price_range: Number(row['Price range']) || 0,
          aggregate_rating: parseFloat(row['Aggregate rating']) || 0,
          rating_color: row['Rating color'] || 'N/A',
          rating_text: row['Rating text'] || 'Sin calificación',
          votes: restaurantVotes,  // Votos asignados
          country_code: Number(row['Country Code']) || 0,
        };

        restaurants.push(formattedRow);
      } catch (error) {
        console.error('Error procesando fila:', error);
      }
    });

    stream.on('end', async () => {
      try {
        if (restaurants.length === 0) {
          console.warn('⚠️ No hay datos válidos para importar.');
        } else {
          await Restaurant.insertMany(restaurants);
          console.log(`✅ Importación finalizada: ${restaurants.length} restaurantes importados.`);
        }
      } catch (error) {
        console.error('❌ Error al insertar restaurantes:', error);
      } finally {
        mongoose.connection.close();
        console.log('🔒 Conexión a MongoDB cerrada.');
      }
    });

    stream.on('error', (error) => {
      console.error('⚠️ Error al procesar el CSV:', error.message);
      mongoose.connection.close();
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    mongoose.connection.close();
  }
};

console.log('🚀 Iniciando script de importación...');
startImport().catch((err) => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});