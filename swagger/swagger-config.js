module.exports = {
  options: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "REST API with Node, Express, and Mongoose",
        version: "1.0.0",
        description: "API documentation with Swagger",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Introduce el token JWT obtenido durante el login"
          }
        }
      }
    },
    apis: ["./routes/*.js"]
  }
};