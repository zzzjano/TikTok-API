import { getTikTokProfile, getTikTokVideo, getTikTokUserPosts, getTikTokAwemeId } from '../services/tiktokService.js';

// Helper to pass errors to global error handler
const handleControllerError = (error, next) => {
    if (!error) return next();
    next(error);
};

// Get TikTok Profile by username
export const getProfile = async (req, res, next) => {
    try {
        const { username } = req.params;
        const data = await getTikTokProfile(username);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};

export const getAwemeId = async (req, res, next) => {
    try {
        const { url } = req.query;
        const awemeId = await getTikTokAwemeId(url);
        res.json({ data: awemeId });
    } catch (error) {
        handleControllerError(error, next);
    }
};

// Get TikTok Video by ID or full URL
export const getVideo = async (req, res, next) => {
    try {
        // Single canonical source: path param /videos/:videoIdentifier
        const { videoIdentifier } = req.params;
        const data = await getTikTokVideo(videoIdentifier);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};

// Get TikTok User Posts by secUid
export const getUserPosts = async (req, res, next) => {
    try {
        const { secUid } = req.params;
        const { cursor = 0, count = 35, coverFormat = 2 } = req.query;
        const data = await getTikTokUserPosts(secUid, cursor, count, coverFormat);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};
