const express = require('express');
const WebSocket = require('ws'); // Importamos el módulo ws
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const server = require('http').createServer(app); // Usamos un servidor HTTP para WebSocket
const wss = new WebSocket.Server({ server }); // WebSocket Server

// Conectar a la base de datos
connectDB().catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Middleware para parsear JSON
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
app.use(express.static('public'));

// Configuración de Swagger
const swaggerConfig = require('./swagger/swagger-config');
const swaggerSpec = swaggerJSDoc(swaggerConfig.options);

// Custom HTML para Swagger UI
const customSwaggerHtml = (req, res) => {
  res.sendFile(path.join(__dirname, 'public/swagger-custom.html'));
};

// Configuración de rutas Swagger
app.get('/api-docs', customSwaggerHtml);
app.use('/swagger-ui', express.static(path.join(__dirname, 'public')));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Configuración de las rutas
const routes = {
  populate: require("./routes/populateRoutes"),
  achievements: require("./routes/achievementRoutes"),
  cities: require("./routes/cityRoutes"),
  restaurants: require("./routes/restaurantRoutes"),
  locations: require("./routes/locationRoutes"),
  users: require("./routes/userRoutes"),
  messages: require("./routes/messageRoutes"),
  events: require("./routes/eventRoutes"),
  auth: require("./routes/authRoutes")

};

// Route declarations
app.use("/api/populate", routes.populate);
app.use("/api/achievements", routes.achievements);
app.use("/api/cities", routes.cities);
app.use("/api/restaurants", routes.restaurants);
app.use("/api/locations", routes.locations);
app.use("/api/users", routes.users);
app.use("/api/messages", routes.messages);
app.use("/api/events", routes.events);
app.use("/api/auth", routes.auth);

// WebSocket: Maneja las conexiones y almacena clientes
const wsClients = [];
app.locals.wsClients = wsClients; // Hacer accesible en toda la app

wss.on('connection', (ws) => {
  console.log('Nuevo cliente WebSocket conectado.');
  wsClients.push(ws);

  // Eliminar cliente al desconectarse
  ws.on('close', () => {
    const index = wsClients.indexOf(ws);
    if (index !== -1) wsClients.splice(index, 1);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
