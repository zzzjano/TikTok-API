/**
 * Middleware to validate TikTok URL parameter
 * 
 * Ensures that the 'url' query parameter is present and is a valid string
 * when using the /awemeid endpoint.
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @returns {void|express.Response} Error response if validation fails
 */
export const validateAwemeUrl = (req, res, next) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ 
            error: 'Query parameter "url" is required and must be a valid string',
            example: '/api/tiktok/awemeid?url=https://www.tiktok.com/@user/video/1234567890'
        });
    }

    if (!url.includes('tiktok')) {
        return res.status(400).json({ 
            error: 'Invalid TikTok URL',
            example: '/api/tiktok/awemeid?url=https://www.tiktok.com/@user/video/1234567890'
        });
    }

    next();
};
