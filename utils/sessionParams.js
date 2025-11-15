// Generate random session parameters
export const getSessionParams = async () => {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
    const app_language = "en-GB";
    const browser_language = "en-GB";
    const platform = "Win32";
    const timezone = "Europe/Warsaw";

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        "WebIdLastTime": "1763164403",
        "aid": "1988",
        "app_language": app_language,
        "app_name": "tiktok_web",
        "browser_language": browser_language,
        "browser_name": "Mozilla",
        "browser_online": "true",
        "browser_platform": platform,
        "browser_version": userAgent,
        "channel": "tiktok_web",
        "cookie_enabled": "true",
        "data_collection_enabled": "true",
        "device_id": getRandomInt(10**18, 10**19 - 1).toString(),
        "device_platform": "web_pc",
        "focus_state": "true",
        "from_page": "user",
        "history_len": getRandomInt(1, 10).toString(),
        "is_fullscreen": "false",
        "is_page_visible": "true",
        "language": app_language,
        "os": "windows",
        "priority_region": "PL",
        "referer": "https://www.tiktok.com/explore",
        "region": "PL",
        "root_referer": "https://www.tiktok.com/explore",
        "screen_height": "1080",
        "screen_width": "1920",
        "tz_name": timezone,
        "user_is_login": "true",
        "verifyFp": "verify_mhzilhve_F8yQntdt_h3pV_4vb3_9o9z_y772MhlILxuj",
        "video_encoding": "mp4",
        "webcast_language": app_language
    };
};
