import { getSessionParams } from './sessionParams.js';
import { getCookies, extractTokensFromCookies } from './cookieManager.js';
import { createNewTorSession, tor } from '../services/torService.js';
import { requestQueue } from './requestQueue.js';
import { tiktok_errors } from './errorCodes.js';
import signBogus from './xbogus.js';
import signGnarly from './xgnarly.js';

// Function to execute a TikTok API request with retries and error handling
export const executeTikTokRequest = async (baseUrl, queryStringParams, maxRetries = 3, timeout = 5000) => {
    return requestQueue.add(async () => {
        const nonRetryStatusCodes = [10221, 10222, 10202, 10203, 10204];
        const params = await getSessionParams();
        const cookies = await getCookies();
        const { msToken, odinId } = await extractTokensFromCookies();
        
        // Add msToken and odinId to params if they exist
        if (msToken) params.msToken = msToken;
        if (odinId) params.odinId = odinId;
        
        const queryString = new URLSearchParams({ ...params, ...queryStringParams }).toString();
        let url = `${baseUrl}?${queryString}`;
        const useragent = params.browser_version;
        const body = '';
        
        // Generate X-Bogus and X-Gnarly
        const xBogus = signBogus(
            queryString,
            body,
            useragent,
            Math.floor(Date.now() / 1000)
        );
        
        const xGnarly = signGnarly(
            queryString,
            body,
            useragent,
            0,           // envcode
            '5.1.1'      // version
        );
        
        url += `&X-Bogus=${xBogus}&X-Gnarly=${xGnarly}`;
        
        // Sanitize cookies: remove all line breaks, carriage returns, and non-printable characters
        const sanitizedCookies = cookies
            .replace(/[\r\n\t]/g, '') // Remove \r, \n, \t
            .replace(/[^\x20-\x7E]/g, '') // Remove non-printable ASCII characters
            .trim();
        
        const headers = {
            "User-Agent": useragent,
            "Accept": "*/*",
            "Accept-Language": "en-GB,en-US;q=0.7,en;q=0.3",
            "Referer": "https://www.tiktok.com/explore",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "cookie": sanitizedCookies
        };

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await createNewTorSession();
                const response = await tor.get(url, { headers });
                
                if (response.status === 400) {
                    throw [response.status, 400, `Invalid or non-existent value. Received 400 error from TikTok.`];
                }

                // Check if response is empty string - this indicates blocking/captcha
                if (typeof response.data === 'string' && response.data.trim() === '') {
                    console.error('Received empty response - possible IP blocking or captcha challenge');
                    throw new Error('Empty response from TikTok - possible blocking');
                }

                const statusCode = response.data.statusCode;
                
                // If statusCode is undefined or null, treat as success (some endpoints don't return statusCode)
                if (statusCode === undefined || statusCode === null) {
                    return {data: response.data};
                }
                
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
