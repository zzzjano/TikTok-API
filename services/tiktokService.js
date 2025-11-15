/**
 * TikTok Service
 * 
 * Business logic for TikTok API operations.
 * Handles data retrieval and processing for TikTok endpoints.
 * 
 * @module services/tiktokService
 */

import { executeTikTokRequest } from '../utils/requestHelper.js';
import { tiktokEndpoints } from '../utils/tiktokEndpoints.js';

/**
 * Fetch TikTok user profile
 * 
 * @param {string} username - TikTok username
 * @returns {Promise<Object>} User profile data
 * @throws {Error} If username is invalid or user not found
 */
export const getTikTokProfile = async (username) => {
    const queryStringParams = { uniqueId: username };
    return await executeTikTokRequest(tiktokEndpoints.getUserProfile, queryStringParams);
};

/**
 * Extract video ID (awemeId) from either plain ID or full TikTok URL
 * 
 * @param {string} input - Video ID or TikTok URL
 * @returns {string} Extracted video ID
 * @throws {Error} If input is invalid or video ID cannot be extracted
 */
const extractVideoIdFromInput = (input) => {
    if (!input || typeof input !== 'string') {
        throw new Error('Video identifier must be a non-empty string');
    }

    // If it looks like a URL, try to extract the numeric id
    const urlPattern = /https?:\/\/\S+/;
    const awemePattern = /video\/(\d+)/;

    if (urlPattern.test(input)) {
        const match = input.match(awemePattern);
        if (!match) {
            throw new Error('Could not extract video id from provided URL');
        }
        return match[1];
    }

    // Otherwise treat it as a raw id
    return input;
};

/**
 * Fetch TikTok video details
 * 
 * Accepts either a plain video ID or a full TikTok URL
 * 
 * @param {string} videoIdentifier - Video ID or TikTok URL
 * @returns {Promise<Object>} Video details data
 * @throws {Error} If video identifier is invalid or video not found
 */
export const getTikTokVideo = async (videoIdentifier) => {
    const itemId = extractVideoIdFromInput(videoIdentifier);
    const queryStringParams = { itemId };
    return await executeTikTokRequest(tiktokEndpoints.getVideoDetail, queryStringParams);
};

/**
 * Fetch TikTok user posts
 * 
 * @param {string} secUid - User's secUid
 * @param {number} cursor - Pagination cursor
 * @param {number} count - Number of posts to retrieve
 * @param {number} coverFormat - Cover image format
 * @returns {Promise<Object>} User posts data
 * @throws {Error} If parameters are invalid or request fails
 */
export const getTikTokUserPosts = async (secUid, cursor, count, coverFormat) => {
    const queryStringParams = { 
        secUid, 
        cursor: cursor.toString(), 
        count: count.toString(), 
        coverFormat: coverFormat.toString() 
    };
    return await executeTikTokRequest(tiktokEndpoints.getUserPosts, queryStringParams);
};

/**
 * Extract Aweme ID from TikTok URL
 * 
 * @param {string} url - TikTok video or photo URL
 * @returns {Promise<string>} Extracted Aweme ID
 * @throws {Error} If URL is invalid or Aweme ID cannot be extracted
 */
export const getTikTokAwemeId = async (url) => {
    try {
        const urlPattern = /https?:\/\/\S+/;
        const TIKTOK_AWEMEID_PATTERN = /video\/(\d+)/;
        const TIKTOK_PHOTOID_PATTERN = /photo\/(\d+)/;
        
        if (typeof url === 'string') {
            const match = url.match(urlPattern);
            url = match ? match[0] : null;
        }

        if (url === null) {
            const error = new Error('Invalid URL format');
            error.statusCode = 400;
            throw error;
        }

        if (url.includes("tiktok") && url.includes("@")) {
            const video_match = url.match(TIKTOK_AWEMEID_PATTERN);
            const photo_match = url.match(TIKTOK_PHOTOID_PATTERN);

            if (!video_match && !photo_match) {
                const error = new Error('Specified video link is invalid');
                error.statusCode = 400;
                throw error;
            }

            const aweme_id = video_match ? video_match[1] : photo_match[1];
            return aweme_id;
        }
        
        const error = new Error('URL does not appear to be a valid TikTok video or photo URL');
        error.statusCode = 400;
        throw error;

    } catch (error) {
        // Re-throw with proper error structure
        if (error.statusCode) {
            throw error;
        }
        
        const newError = new Error(error.message || 'Failed to extract Aweme ID');
        newError.statusCode = 400;
        throw newError;
    }
};

/**
 * Fetch TikTok video comments
 * 
 * @param {string} awemeId - Video ID
 * @param {number} cursor - Pagination cursor
 * @param {number} count - Number of comments to retrieve
 * @returns {Promise<Object>} Comments data
 * @throws {Error} If parameters are invalid or request fails
 */
export const getTikTokComments = async (awemeId, cursor = 0, count = 20) => {
    const queryStringParams = { 
        aweme_id: awemeId,
        cursor: cursor.toString(), 
        count: count.toString()
    };
    return await executeTikTokRequest(tiktokEndpoints.getComments, queryStringParams);
};
