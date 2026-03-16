import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API with TypeScript',
      version: '1.0.0',
      description: 'A simple Todo API built with Express and TypeScript',
    },
    servers: [
      {
        url: '/api',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

// Custom CSS for Swagger from CDN (Dark Theme)
export const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customCss: '.swagger-ui .topbar { background-color: #1a1a1a; } .swagger-ui .info .title { color: #ffffff; } body { background-color: #121212; color: #e0e0e0; }',
};
