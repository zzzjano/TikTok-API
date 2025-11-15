export const requestLogger = (req, _res, next) => {
    const { method, originalUrl } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
    next();
};
