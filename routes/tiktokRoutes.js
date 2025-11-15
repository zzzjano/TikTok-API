/**
 * TikTok API Routes
 * 
 * Defines all API endpoints for TikTok data retrieval.
 * Routes are prefixed with /api/tiktok
 * 
 * @module routes/tiktokRoutes
 */

import express from 'express';
import { getProfile, getVideo, getUserPosts, getAwemeId } from '../controllers/tiktokController.js';
import { validateAwemeUrl } from '../middleware/validateAwemeUrl.js';

const router = express.Router();

/**
 * @route GET /api/tiktok/users/:username
 * @desc Get user profile by username
 * @access Public
 */
router.get('/users/:username', getProfile);

/**
 * @route GET /api/tiktok/users/:secUid/posts
 * @desc Get user posts by secUid
 * @query cursor - Pagination cursor (default: 0)
 * @query count - Number of posts (default: 35)
 * @query coverFormat - Cover format (default: 2)
 * @access Public
 */
router.get('/users/:secUid/posts', getUserPosts);

/**
 * @route GET /api/tiktok/videos/:videoIdentifier
 * @desc Get video details by ID or full TikTok URL
 * @access Public
 */
router.get('/videos/:videoIdentifier', getVideo);

/**
 * @route GET /api/tiktok/awemeid
 * @desc Extract awemeId from TikTok URL
 * @query url - Full TikTok video or photo URL (required)
 * @access Public
 */
router.get('/awemeid', validateAwemeUrl, getAwemeId);

export default router;
