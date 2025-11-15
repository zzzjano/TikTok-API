import express from 'express';
import tiktokRoutes from './routes/tiktokRoutes.js';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8083;

// Basic middlewares
app.use(express.json());
app.use(requestLogger);

// TikTok API routes
app.use('/api/tiktok', tiktokRoutes);

// Global error handler (should be registered after routes)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
