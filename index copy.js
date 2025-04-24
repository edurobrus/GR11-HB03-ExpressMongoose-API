const express = require('express');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken'); // Añadir esta línea

dotenv.config();

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ noServer: true }); // WebSocket Server

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
  auth: require("./routes/authRoutes"),
  users: require("./routes/userRoutes"),
  messages: require("./routes/messageRoutes")
};

// Route declarations
app.use("/api/populate", routes.populate);
app.use("/api/achievements", routes.achievements);
app.use("/api/cities", routes.cities);
app.use("/api/restaurants", routes.restaurants);
app.use("/api/locations", routes.locations);
app.use("/api/auth", routes.auth);
app.use("/api/users", routes.users);
app.use("/api/messages", routes.messages);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const wsClients = [];
app.locals.wsClients = wsClients;

server.on('upgrade', (request, socket, head) => {
  // 1. Extraer token de los headers
  const authHeader = request.headers['authorization'];
  
  // 2. Verificar presencia del token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // 3. Validar token JWT
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }

    // 4. Autenticación exitosa - manejar upgrade
    wss.handleUpgrade(request, socket, head, (ws) => {
      // 5. Almacenar conexión y metadata del usuario
      ws.user = decoded;
      wsClients.push(ws);
      
      // 6. Configurar handlers de eventos
      ws.on('close', () => {
        const index = wsClients.indexOf(ws);
        if (index !== -1) wsClients.splice(index, 1);
      });

      // 7. Notificar conexión exitosa
      console.log(`Nuevo cliente autenticado: ${ws.user.userId}`);
      ws.send(JSON.stringify({
        event: 'connection:success',
        data: { userId: ws.user.userId }
      }));
    });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
