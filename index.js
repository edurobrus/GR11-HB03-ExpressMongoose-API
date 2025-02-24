const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const Item = require('./models/Item');

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API REST con Node, Express y Mongoose');
});

// Endpoint para insertar datos de prueba
app.get('/api/seed', async (req, res) => {
  try {
    // Opcional: Elimina datos previos para reiniciar la colección
    await Item.deleteMany({});

    // Datos de prueba
    const sampleItems = [
      { name: 'Item 1', description: 'Descripción del item 1' },
      { name: 'Item 2', description: 'Descripción del item 2' },
      { name: 'Item 3', description: 'Descripción del item 3' }
    ];

    // Inserta los datos en la colección
    const createdItems = await Item.insertMany(sampleItems);

    res.json({
      message: 'Datos de prueba insertados correctamente',
      items: createdItems
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al insertar datos de prueba',
      details: error.message
    });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
