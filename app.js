import express from 'express';
import tiktokRoutes from './routes/tiktokRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8083;

// Middleware for parsing JSON bodies
app.use(express.json());

// TikTok API routes
app.use('/api/tiktok', tiktokRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
