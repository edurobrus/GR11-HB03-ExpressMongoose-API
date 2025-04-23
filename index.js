const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const swaggerDocs = require("./config/swaggerConfig");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Middleware
app.use(express.json());

// Swagger Documentation
swaggerDocs(app);

// Root route
app.get("/", (req, res) => {
  res.send("Node.js, Express, and Mongoose REST API.");
});

// Route imports
const routes = {
  populate: require("./routes/populateRoutes"),
  achievements: require("./routes/achievementRoutes"),
  cities: require("./routes/cityRoutes"),
  restaurants: require("./routes/restaurantRoutes"),
  locations: require("./routes/locationRoutes"),
  users: require("./routes/userRoutes")
};

// Route declarations
app.use("/api/populate", routes.populate);
app.use("/api/achievements", routes.achievements);
app.use("/api/cities", routes.cities);
app.use("/api/restaurants", routes.restaurants);
app.use("/api/locations", routes.locations);
app.use("/api/users", routes.users);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});