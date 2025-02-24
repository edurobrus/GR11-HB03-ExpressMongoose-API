const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz de ejemplo
app.get('/', (req, res) => {
  res.send('API REST con Node, Express y Mongoose');
});

// Uso de rutas para el modelo Item
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
