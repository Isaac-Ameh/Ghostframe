import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

// 👻 GhostFrame - AI Starter Framework
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { apiLimiter } from './middleware/rateLimiter';

// Demo routes - showcasing the framework
import quizRoutes from './routes/quiz';
import storyRoutes from './routes/story';
import uploadRoutes from './routes/upload';
import aiGenerationRoutes from './routes/aiGeneration';
import downloadRoutes from './routes/download';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security and logging middleware
app.use(helmet());
app.use(morgan('dev'));

// CORS configuration for frontend communication
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'alive', 
    message: '👻 GhostFrame - AI Starter Framework is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 👻 Demo Routes - Showcasing GhostFrame capabilities
app.use('/api/quiz', quizRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiGenerationRoutes);
app.use('/api/download', downloadRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start the spooky server
app.listen(PORT, () => {
  console.log(`👻 GhostFrame backend haunting on port ${PORT}`);
  console.log(`🎃 Health check: http://localhost:${PORT}/health`);
});

export default app;