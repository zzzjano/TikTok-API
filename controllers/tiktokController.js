/**
 * TikTok API Controllers
 * 
 * Handles HTTP requests for TikTok API endpoints.
 * Controllers receive requests, call appropriate services, and return responses.
 * 
 * @module controllers/tiktokController
 */

import { getTikTokProfile, getTikTokVideo, getTikTokUserPosts, getTikTokAwemeId, getTikTokComments } from '../services/tiktokService.js';

/**
 * Helper to pass errors to global error handler
 * @param {Error} error - Error object to handle
 * @param {Function} next - Express next function
 */
const handleControllerError = (error, next) => {
    if (!error) return next();
    next(error);
};

/**
 * Get TikTok user profile by username
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res, next) => {
    try {
        const { username } = req.params;
        
        if (!username || username.trim() === '') {
            const error = new Error('Username is required');
            error.statusCode = 400;
            throw error;
        }
        
        const data = await getTikTokProfile(username);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};

/**
 * Extract Aweme ID from TikTok URL
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getAwemeId = async (req, res, next) => {
    try {
        const { url } = req.query;
        const awemeId = await getTikTokAwemeId(url);
        res.json({ data: awemeId });
    } catch (error) {
        handleControllerError(error, next);
    }
};

/**
 * Get TikTok video by ID or full URL
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getVideo = async (req, res, next) => {
    try {
        const { videoIdentifier } = req.params;
        
        if (!videoIdentifier || videoIdentifier.trim() === '') {
            const error = new Error('Video identifier is required');
            error.statusCode = 400;
            throw error;
        }
        
        const data = await getTikTokVideo(videoIdentifier);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};

/**
 * Get TikTok user posts by secUid
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getUserPosts = async (req, res, next) => {
    try {
        const { secUid } = req.params;
        const { cursor = 0, count = 35, coverFormat = 2 } = req.query;
        
        if (!secUid || secUid.trim() === '') {
            const error = new Error('SecUid is required');
            error.statusCode = 400;
            throw error;
        }
        
        // Validate numeric parameters
        const parsedCursor = parseInt(cursor, 10);
        const parsedCount = parseInt(count, 10);
        const parsedCoverFormat = parseInt(coverFormat, 10);
        
        if (isNaN(parsedCursor) || isNaN(parsedCount) || isNaN(parsedCoverFormat)) {
            const error = new Error('Invalid query parameters: cursor, count, and coverFormat must be numbers');
            error.statusCode = 400;
            throw error;
        }
        
        const data = await getTikTokUserPosts(secUid, parsedCursor, parsedCount, parsedCoverFormat);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};

/**
 * Get TikTok video comments
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getComments = async (req, res, next) => {
    try {
        const { awemeId } = req.params;
        const { cursor = 0, count = 20 } = req.query;
        
        if (!awemeId || awemeId.trim() === '') {
            const error = new Error('Aweme ID is required');
            error.statusCode = 400;
            throw error;
        }
        
        // Validate numeric parameters
        const parsedCursor = parseInt(cursor, 10);
        const parsedCount = parseInt(count, 10);
        
        if (isNaN(parsedCursor) || isNaN(parsedCount)) {
            const error = new Error('Invalid query parameters: cursor and count must be numbers');
            error.statusCode = 400;
            throw error;
        }
        
        const data = await getTikTokComments(awemeId, parsedCursor, parsedCount);
        res.json(data);
    } catch (error) {
        handleControllerError(error, next);
    }
};
