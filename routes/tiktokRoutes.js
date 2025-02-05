import express from 'express';
import { getProfile, getVideo, getUserPosts, getAwemeId} from '../controllers/tiktokController.js';

const router = express.Router();

router.get('/profile/:username', getProfile);
router.get('/video/:videoId', getVideo);
router.get('/posts/:secUid', getUserPosts);
router.get('/awemeid', getAwemeId);

export default router;
