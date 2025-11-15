// Simple middleware to validate TikTok URL when using /awemeid endpoint
export const validateAwemeUrl = (req, res, next) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Query parameter "url" is required' });
    }

    next();
};
