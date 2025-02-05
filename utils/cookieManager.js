import fs from 'fs/promises';

let cachedCookies = null;

// Load cookies from cache
export const getCookies = async () => {
    if (!cachedCookies) {
        cachedCookies = await fs.readFile('./cookies.txt', 'utf-8');
    }
    return cachedCookies.trim();
};
