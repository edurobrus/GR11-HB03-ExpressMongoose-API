const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const iconv = require('iconv-lite'); // Add this line
const dotenv = require('dotenv');
const Restaurant = require('../models/Restaurant');
const connectDB = require('../config/db');

dotenv.config();

// Conectar a la base de datos primero
console.log('🔄 Conectando a MongoDB...');
connectDB();
console.log('✅ Conexión a MongoDB establecida');

// Ruta del archivo CSV
const csvFilePath = path.join(__dirname, '../data/Restaurant.csv');

const importData = async () => {
  try {
    // Verificar la estructura de la colección y el esquema
    console.log('🔍 Verificando el modelo Restaurant...');
    console.log('- Nombre de la colección:', Restaurant.collection.name);
    console.log('- Estructura del esquema:', Object.keys(Restaurant.schema.paths).join(', '));

    // Limpiar colección existente
    console.log('🧹 Limpiando colección existente...');
    await Restaurant.deleteMany({});
    console.log('✅ Colección limpiada.');

    // Verificar que la colección esté vacía
    const initialCount = await Restaurant.countDocuments();
    console.log(`📊 Documentos iniciales en la colección: ${initialCount}`);

    // Array para almacenar los restaurantes
    const restaurants = [];

    // Read the CSV file with the correct encoding
    fs.createReadStream(csvFilePath)
      .pipe(iconv.decodeStream('utf8')) 
      .pipe(csvParser({
        strict: true,
        mapHeaders: ({ header }) => header.trim()  // Eliminar espacios en los encabezados
      }))
      .on('headers', (headers) => {
        console.log('📋 Encabezados del CSV:', headers);
      })
      .on('data', async (row) => {
        // Mapear los datos al esquema
        const formattedRow = {
          name: row['Restaurant Name'] || 'Desconocido',
          address: row['Address'] || 'Sin dirección',
          city: row['City'] || 'Desconocido',
          locality: row['Locality'] || 'Desconocido',
          locality_verbose: row['Locality Verbose'] || 'N/A',
          longitude: parseFloat(row['Longitude']) || 0,
          latitude: parseFloat(row['Latitude']) || 0,
          cuisines: row['Cuisines'] ? row['Cuisines'].split(',').map(c => c.trim()).join(', ') : 'Desconocido',
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
          votes: Number(row['Votes']) || 0,
          country_code: Number(row['Country Code']) || 0,
        };

        restaurants.push(formattedRow);
      })
      .on('end', async () => {
        await Restaurant.insertMany(restaurants);
        console.log(`✅ Importación finalizada: ${restaurants.length} restaurantes importados.`);
        mongoose.connection.close();
      })
      .on('error', (error) => {
        console.error('⚠️ Error al procesar el archivo CSV:', error.message);
        mongoose.connection.close();
      });

  } catch (error) {
    console.error('❌ Error general al importar datos:', error);
    mongoose.connection.close();
  }
};

// Ejecutar la función
console.log('🚀 Iniciando script de importación...');
importData().catch(err => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});