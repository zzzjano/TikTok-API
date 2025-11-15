/**
 * TikTok API Endpoints
 * 
 * Centralized configuration of TikTok API endpoint URLs.
 * 
 * @module utils/tiktokEndpoints
 */

/**
 * TikTok API endpoint URLs
 * @constant
 * @type {Object}
 */
export const tiktokEndpoints = {
    /** User profile endpoint */
    getUserProfile: 'https://www.tiktok.com/api/user/detail/',
    /** Video details endpoint */
    getVideoDetail: 'https://www.tiktok.com/api/item/detail/',
    /** User posts endpoint */
    getUserPosts: 'https://www.tiktok.com/api/post/item_list/',
};
