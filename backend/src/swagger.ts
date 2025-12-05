// 🎃 GhostFrame API Documentation - Swagger/OpenAPI Configuration

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GhostFrame API',
      version: '1.0.0',
      description: '🎃 AI-Powered Modular Framework API - Where dead tech learns new tricks!',
      contact: {
        name: 'GhostFrame Team',
        url: 'https://github.com/Isaac-Ameh/Ghostframe',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.ghostframe.dev',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Module: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'quiz-ghost' },
            name: { type: 'string', example: 'Quiz Ghost' },
            description: { type: 'string', example: 'AI-powered quiz generation' },
            version: { type: 'string', example: '1.0.0' },
            author: { type: 'string', example: 'GhostFrame Team' },
            category: { type: 'string', example: 'education' },
            tags: { type: 'array', items: { type: 'string' }, example: ['quiz', 'ai', 'education'] },
            downloads: { type: 'number', example: 1250 },
            rating: { type: 'number', example: 4.5 },
            reviewCount: { type: 'number', example: 42 },
            featured: { type: 'boolean', example: true },
            verified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            moduleId: { type: 'string' },
            userId: { type: 'string' },
            userName: { type: 'string', example: 'John Doe' },
            rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Excellent module!' },
            helpful: { type: 'number', example: 12 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            quizId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['multiple_choice', 'true_false', 'short_answer'] },
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctAnswer: { type: 'string' },
                  explanation: { type: 'string' },
                  difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
                  topic: { type: 'string' },
                  points: { type: 'number' },
                },
              },
            },
            metadata: {
              type: 'object',
              properties: {
                totalQuestions: { type: 'number' },
                totalPoints: { type: 'number' },
                estimatedTime: { type: 'number' },
                difficulty: { type: 'string' },
                topics: { type: 'array', items: { type: 'string' } },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        Story: {
          type: 'object',
          properties: {
            storyId: { type: 'string' },
            title: { type: 'string' },
            story: { type: 'string' },
            characters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  role: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
            themes: { type: 'array', items: { type: 'string' } },
            summary: { type: 'string' },
            metadata: {
              type: 'object',
              properties: {
                wordCount: { type: 'number' },
                readingTime: { type: 'number' },
                genre: { type: 'string' },
                audience: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
            code: { type: 'string', example: 'ERROR_CODE' },
            details: { type: 'object' },
          },
        },
      },
    },
    tags: [
      { name: 'Marketplace', description: 'Module marketplace operations' },
      { name: 'Reviews', description: 'Module review operations' },
      { name: 'Modules', description: 'Module execution and management' },
      { name: 'AI', description: 'AI-powered content generation' },
      { name: 'Admin', description: 'Administrative operations' },
      { name: 'Health', description: 'System health and status' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'GhostFrame API Documentation',
  }));

  // JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;