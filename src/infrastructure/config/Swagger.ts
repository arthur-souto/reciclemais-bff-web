import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RecicleMais BFF API",
    version: "1.0.0",
    description: [
      "Documentação interativa (OpenAPI 3.0) da API do backend/BFF do projeto RecicleMais.",
      "",
      "**Autenticação**: rotas marcadas com um cadeado exigem um token JWT. Gere um em `POST /auth/login`",
      "(usando um usuário criado via `POST /users`), copie o valor de `accessToken` e clique em **Authorize**",
      "no topo desta página, colando apenas o token (sem o prefixo `Bearer`, o Swagger adiciona automaticamente).",
    ].join("\n"),
  },
  servers: [
    {
      url: "/",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [
    "./src/adapters/in/http/*.ts",
    "./src/adapters/in/http/route/*.ts",
    "./dist/adapters/in/http/*.js",
    "./dist/adapters/in/http/route/*.js",
  ],
});
