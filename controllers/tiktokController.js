import { getTikTokProfile, getTikTokVideo, getTikTokUserPosts, getTikTokAwemeId } from '../services/tiktokService.js';

// Get TikTok Profile
export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const data = await getTikTokProfile(username);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAwemeId = async (req, res) => {
    try {
        const { url } = req.query;
        const awemeId = await getTikTokAwemeId(url);
        res.json({ data:awemeId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get TikTok Video
export const getVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const data = await getTikTokVideo(videoId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get TikTok User Posts
export const getUserPosts = async (req, res) => {
    try {
        const { secUid } = req.params;
        const { cursor = 0, count = 35, coverFormat = 2 } = req.query;
        const data = await getTikTokUserPosts(secUid, cursor, count, coverFormat);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
