/**
 * TikTok API Routes
 * 
 * Defines all API endpoints for TikTok data retrieval.
 * Routes are prefixed with /api/tiktok
 * 
 * @module routes/tiktokRoutes
 */

import express from 'express';
import { getProfile, getVideo, getUserPosts, getAwemeId, getComments, getFollowers, getFollowings } from '../controllers/tiktokController.js';
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

/**
 * @route GET /api/tiktok/videos/:awemeId/comments
 * @desc Get video comments by awemeId
 * @query cursor - Pagination cursor (default: 0)
 * @query count - Number of comments (default: 20)
 * @access Public
 */
router.get('/videos/:awemeId/comments', getComments);

/**
 * @route GET /api/tiktok/users/:secUid/followers
 * @desc Get user followers by secUid
 * @query maxCursor - Maximum cursor for pagination (default: 0)
 * @query minCursor - Minimum cursor for pagination (default: 0)
 * @query count - Number of followers (default: 30)
 * @query scene - Scene parameter (default: 67)
 * @access Public
 */
router.get('/users/:secUid/followers', getFollowers);

/**
 * @route GET /api/tiktok/users/:secUid/following
 * @desc Get user followings (accounts followed by the user) by secUid
 * @query maxCursor - Maximum cursor for pagination (default: 0)
 * @query minCursor - Minimum cursor for pagination (default: 0)
 * @query count - Number of followings (default: 30)
 * @query scene - Scene parameter (default: 21)
 * @access Public
 */
router.get('/users/:secUid/following', getFollowings);

export default router;
