import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RecicleMais BFF API",
    version: "1.0.0",
    description: "Documentação da API do backend/BFF do projeto RecicleMais",
  },
  servers: [
    {
      url: "/",
    },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ["./src/adapters/in/http/*.ts", "./dist/adapters/in/http/*.js"],
});
