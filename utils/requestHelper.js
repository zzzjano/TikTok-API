import { getSessionParams } from './sessionParams.js';
import { getCookies } from './cookieManager.js';
import { createNewTorSession, tor } from '../services/torService.js';
import { requestQueue } from './requestQueue.js';
import xbogus from 'xbogus';
import { tiktok_errors } from './errorCodes.js';

// Function to execute a TikTok API request with retries and error handling
export const executeTikTokRequest = async (baseUrl, queryStringParams, maxRetries = 3, timeout = 5000) => {
    return requestQueue.add(async () => {
        const nonRetryStatusCodes = [10221, 10222, 10202, 10203, 10204];
        const params = await getSessionParams();
        const cookies = await getCookies();
        
        let url = `${baseUrl}?${new URLSearchParams({ ...params, ...queryStringParams }).toString()}`;
        const useragent = params.browser_version;
        const tiktok_xbogus = xbogus(url, useragent);
        
        url += `&X-Bogus=${tiktok_xbogus}`;
        const headers = {
            "User-Agent": useragent,
            "cookie": cookies.replace(/\n/g, '')
        };

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await createNewTorSession();
                const response = await tor.get(url, { headers });
                
                if (response.status === 400) {
                    throw [response.status, 400, `Invalid or non-existent value. Received 400 error from TikTok.`];
                }

                const statusCode = response.data.statusCode;
                
                if (nonRetryStatusCodes.includes(statusCode)) {
                    const errorMessage = tiktok_errors[statusCode] || 'Unknown error';
                    throw [response.status, statusCode, `Specified user/video does not exist on TikTok: ${errorMessage}`];
                }

                if (statusCode !== 0) {
                    const errorMessage = tiktok_errors[statusCode] || 'Unknown error';
                    throw [response.status, statusCode, `TikTok API Error: ${errorMessage}`];
                }

                return {data: response.data};
            } catch (error) {
                if (Array.isArray(error) && error.length === 3) {
                    const [responseStatus, tiktokStatus, message] = error;

                    // Check for non-retry status codes
                    if (nonRetryStatusCodes.includes(tiktokStatus)) {
                        throw new Error(`Non-retryable error: ${message}`);
                    }

                    console.error(`Error: ${message} (Response Status: ${responseStatus}, TikTok Status: ${tiktokStatus})`);
                } else {
                    console.error(`Error: ${error.message || error}`);
                }

                if (attempt < maxRetries) {
                    console.warn(`Attempt ${attempt} failed. Retrying...`);
                    await createNewTorSession();
                    await new Promise(resolve => setTimeout(resolve, timeout)); // Timeout before the next attempt
                } else {
                    throw new Error(`Max retries reached or non-retryable error: ${error.message || error}`);
                }
            }
        }
    });
};
