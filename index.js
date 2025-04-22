const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const swaggerDocs = require("./config/swaggerConfig");
const { loadModels } = require("./models");  // Importar el cargador de modelos

dotenv.config();

const app = express();
loadModels();
const startServer = async () => {
  try {
    await connectDB();
    app.use(express.json());
    swaggerDocs(app);
    const restaurantRoutes = require("./routes/restaurantRoutes");
    app.use("/api/restaurants", restaurantRoutes);

    const citieRoutes = require("./routes/citieRoutes");
    app.use("/api/cities", citieRoutes);

    // Ruta raíz
    app.get("/", (req, res) => {
      res.send("API REST con Node, Express y Mongongoose");
    });

    // 5. Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor activo en: http://localhost:${PORT}
📚 Documentación disponible en: http://localhost:${PORT}/api-docs
      `);
    });

  } catch (error) {
    console.error("❌ Fallo crítico al iniciar:", error);
    process.exit(1);
  }
};

startServer();