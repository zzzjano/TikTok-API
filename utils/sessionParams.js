// Generate random session parameters
export const getSessionParams = async () => {
    const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)";
    const app_language = "en";
    const browser_language = "en-GB";
    const platform = "Win32";
    const timezone = "Europe/Warsaw";

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        "aid": "1988",
        "app_language": app_language,
        "app_name": "tiktok_web",
        "browser_language": browser_language,
        "browser_name": "Mozilla",
        "browser_online": "true",
        "browser_platform": platform,
        "browser_version": userAgent,
        "cookie_enabled": "true",
        "device_id": getRandomInt(10**18, 10**19 - 1).toString(),
        "device_platform": "web_pc",
        "focus_state": "true",
        "from_page": "user",
        "history_len": getRandomInt(1, 10).toString(),
        "is_fullscreen": "false",
        "is_page_visible": "true",
        "language": app_language,
        "os": "ios",
        "region": "PL",
        "screen_height": getRandomInt(600, 1080).toString(),
        "screen_width": getRandomInt(800, 1920).toString(),
        "tz_name": timezone,
        "webcast_language": app_language
    };
};
