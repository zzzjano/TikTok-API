/**
 * TikTok API Server
 * 
 * A Node.js API service for fetching TikTok data with optional Tor integration
 * to bypass IP blocking. Includes rate limiting and request queuing.
 * 
 * @module app
 */

import express from 'express';
import dotenv from 'dotenv';
import tiktokRoutes from './routes/tiktokRoutes.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validateEnvironment, printConfiguration } from './utils/configValidator.js';

// Load environment variables
dotenv.config();

// Validate configuration before starting
try {
    validateEnvironment();
    printConfiguration();
} catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 8083;

// Basic middlewares
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API documentation redirect
app.get('/', (_req, res) => {
    res.json({
        name: 'TikTok API',
        version: '1.0.0',
        description: 'A secure Node.js API service for fetching TikTok data',
        endpoints: {
            health: '/health',
            userProfile: '/api/tiktok/users/:username',
            userPosts: '/api/tiktok/users/:secUid/posts',
            userFollowers: '/api/tiktok/users/:secUid/followers',
            userFollowing: '/api/tiktok/users/:secUid/following',
            videoDetails: '/api/tiktok/videos/:videoIdentifier',
            videoComments: '/api/tiktok/videos/:awemeId/comments',
            awemeId: '/api/tiktok/awemeid?url=<tiktok_url>'
        },
        documentation: 'https://github.com/zzzjano/TikTok-API'
    });
});

// TikTok API routes
app.use('/api/tiktok', tiktokRoutes);

// 404 handler for undefined routes
app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler (must be registered after all routes)
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API documentation: http://localhost:${port}`);
    console.log(`❤️  Health check: http://localhost:${port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    process.exit(0);
});
