/**
 * Centralized error handling middleware
 * 
 * Catches all errors thrown in the application and formats them consistently.
 * Logs errors to console and returns appropriate HTTP status codes.
 * 
 * @param {Error} err - The error object
 * @param {express.Request} _req - Express request object (unused)
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} _next - Express next function (unused)
 */
export const errorHandler = (err, _req, res, _next) => {
    // Log error details for debugging
    console.error('[Error Handler]', {
        message: err.message,
        status: err.statusCode || 500,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Send error response
    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
