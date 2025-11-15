/**
 * Request logging middleware
 * 
 * Logs all incoming HTTP requests with timestamp, method, and URL.
 * 
 * @param {express.Request} req - Express request object
 * @param {express.Response} _res - Express response object (unused)
 * @param {express.NextFunction} next - Express next function
 */
export const requestLogger = (req, _res, next) => {
    const { method, originalUrl, ip } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${ip}`);
    next();
};
