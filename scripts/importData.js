const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const dotenv = require('dotenv');
const Item = require('../models/Item');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const csvFilePath = path.join(__dirname, '../data/items.csv');

const importData = async () => {
  try {
    const items = [];

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        items.push(row);
      })
      .on('end', async () => {
        await Item.insertMany(items);
        console.log('✅ Datos importados correctamente.');
        mongoose.connection.close();
      });

  } catch (error) {
    console.error('❌ Error al importar datos:', error);
    mongoose.connection.close();
  }
};

importData();
