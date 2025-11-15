/**
 * Cookie Management Utilities
 * 
 * Handles loading and parsing of TikTok cookies from the cookies.txt file.
 * Provides functions to extract specific cookie values.
 * 
 * @module utils/cookieManager
 */

import fs from 'fs/promises';

let cachedCookies = null;

/**
 * Load cookies from cache or file
 * 
 * Reads cookies from cookies.txt and caches them in memory for subsequent requests.
 * 
 * @returns {Promise<string>} Cookie string
 * @throws {Error} If cookies.txt cannot be read
 */
export const getCookies = async () => {
    if (!cachedCookies) {
        try {
            cachedCookies = await fs.readFile('./cookies.txt', 'utf-8');
        } catch (error) {
            throw new Error(`Failed to load cookies: ${error.message}`);
        }
    }
    return cachedCookies.trim();
};

/**
 * Extract specific cookie value by name
 * 
 * @param {string} cookieString - Full cookie string
 * @param {string} cookieName - Name of the cookie to extract
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookieValue = (cookieString, cookieName) => {
    const match = cookieString.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]*)`));
    return match ? match[1] : null;
};

/**
 * Extract msToken and odinId from cookies
 * 
 * @returns {Promise<{msToken: string|null, odinId: string|null}>} Token object
 * @throws {Error} If cookies cannot be loaded
 */
export const extractTokensFromCookies = async () => {
    const cookies = await getCookies();
    return {
        msToken: getCookieValue(cookies, 'msToken'),
        odinId: getCookieValue(cookies, 'odin_tt')
    };
};
