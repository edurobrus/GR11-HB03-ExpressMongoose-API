const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API REST con Node, Express y Mongoose",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // Asegúrate de que coincide con tu configuración
      },
    ],
  },
  apis: ["./routes/*.js"], // Aquí se leerán las rutas con documentación
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger Docs disponibles en: http://localhost:3000/api-docs");
};

module.exports = swaggerDocs;
