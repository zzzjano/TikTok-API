import fs from 'fs/promises';

let cachedCookies = null;

// Load cookies from cache
export const getCookies = async () => {
    if (!cachedCookies) {
        cachedCookies = await fs.readFile('./cookies.txt', 'utf-8');
    }
    return cachedCookies.trim();
};

// Extract specific cookie value by name
export const getCookieValue = (cookieString, cookieName) => {
    const match = cookieString.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]*)`));
    return match ? match[1] : null;
};

// Extract msToken and odinId from cookies
export const extractTokensFromCookies = async () => {
    const cookies = await getCookies();
    return {
        msToken: getCookieValue(cookies, 'msToken'),
        odinId: getCookieValue(cookies, 'odin_tt')
    };
};
