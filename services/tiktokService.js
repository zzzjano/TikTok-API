import { executeTikTokRequest } from '../utils/requestHelper.js';
import { tiktokEndpoints } from '../utils/tiktokEndpoints.js';

// Fetch TikTok profile
export const getTikTokProfile = async (username) => {
    const queryStringParams = { uniqueId: username };
    return await executeTikTokRequest(tiktokEndpoints.getUserProfile, queryStringParams);
};

// Fetch TikTok video
export const getTikTokVideo = async (videoId) => {
    const queryStringParams = { itemId: videoId };
    return await executeTikTokRequest(tiktokEndpoints.getVideoDetail, queryStringParams);
};

// Fetch TikTok user posts
export const getTikTokUserPosts = async (secUid, cursor, count, coverFormat) => {
    const queryStringParams = { secUid, cursor: cursor.toString(), count: count.toString(), coverFormat: coverFormat.toString() };
    return await executeTikTokRequest(tiktokEndpoints.getUserPosts, queryStringParams);
};

export const getTikTokAwemeId = async (url) => {
    try{
    const urlPattern = /https?:\/\/\S+/;
    const TIKTOK_AWEMEID_PATTERN = /video\/(\d+)/;
    const TIKTOK_PHOTOID_PATTERN = /photo\/(\d+)/;
    const TIKTOK_NOTFOUND_PATTERN = /notfound/;
    
    if (typeof url === 'string') {
        const match = url.match(urlPattern);
        url = match ? match[0] : null;
    }

    if(url === null) {
        throw [400, 400, 'Invalid URL format'];
    }

    if(url.includes("tiktok")  && url.includes("@")){
        const video_match = url.match(TIKTOK_AWEMEID_PATTERN);
        const photo_match = url.match(TIKTOK_PHOTOID_PATTERN);

        if(!video_match && !photo_match){
            throw [400, 400, 'Specified video link is invalid.'];
        }

        const aweme_id = video_match ? video_match[1] : photo_match[1];

        return aweme_id;
    }

}catch(error){
    if (Array.isArray(error) && error.length === 3) {
        const [responseStatus, tiktokStatus, message] = error;

        console.error(`Error: ${message} (Response Status: ${responseStatus}, TikTok Status: ${tiktokStatus})`);
        throw new Error(`${message}`);
    } else {
        console.error(`Error: ${error.message || error}`);
        throw new Error(`${error.message || error}`);
    }
}
}
