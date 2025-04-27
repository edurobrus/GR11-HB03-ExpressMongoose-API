module.exports = {
  options: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "REST API with Node, Express, and Mongoose",
        version: "1.0.0",
        description: 
        "<b>API documentation with Swagger</b>\n\n" + 
        "\n\n" + 
        "Created by:\n\n" +
        "- Eduardo Robles Russo\n\n" +
        "- Manuel Jesús Niza Cobo",
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
            description: "Enter the JWT token obtained during authentication"
          }
        }
      }
    },
    apis: ["./routes/*.js"]
  }
};