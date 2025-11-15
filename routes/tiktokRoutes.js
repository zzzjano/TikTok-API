import express from 'express';
import { getProfile, getVideo, getUserPosts, getAwemeId } from '../controllers/tiktokController.js';
import { validateAwemeUrl } from '../middleware/validateAwemeUrl.js';

const router = express.Router();

// GET /api/tiktok/users/:username - get user profile by username
router.get('/users/:username', getProfile);

// GET /api/tiktok/users/:secUid/posts - get user posts by secUid
router.get('/users/:secUid/posts', getUserPosts);

// GET /api/tiktok/videos/:videoIdentifier - get video by id or full TikTok URL
router.get('/videos/:videoIdentifier', getVideo);

// GET /api/tiktok/awemeid?url=<tiktok_url> - extract awemeId from URL
router.get('/awemeid', validateAwemeUrl, getAwemeId);

export default router;
