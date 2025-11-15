/**
 * Request Queue Implementation
 * 
 * Manages a queue of API requests with configurable minimum delays between requests.
 * Ensures rate limiting and prevents overwhelming the TikTok API.
 * 
 * @module utils/requestQueue
 */

/**
 * Request Queue Class
 * 
 * Implements a FIFO queue for managing asynchronous requests with rate limiting.
 */
class RequestQueue {
    /**
     * Create a request queue
     * 
     * @param {number} minDelayMs - Minimum delay between requests in milliseconds
     */
    constructor(minDelayMs = 5000) {
        this.queue = [];
        this.isProcessing = false;
        this.lastRequestTime = 0;
        this.minDelayMs = minDelayMs;
    }

    /**
     * Add a request to the queue
     * 
     * @param {Function} requestFn - Async function that executes the request
     * @returns {Promise} Promise that resolves with the request result
     */
    async add(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFn, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Process queued requests
     * 
     * Executes requests one by one with minimum delay between them.
     * 
     * @private
     * @returns {Promise<void>}
     */
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const timeSinceLastRequest = Date.now() - this.lastRequestTime;
            const timeToWait = Math.max(0, this.minDelayMs - timeSinceLastRequest);

            if (timeToWait > 0) {
                await new Promise(resolve => setTimeout(resolve, timeToWait));
            }

            const { requestFn, resolve, reject } = this.queue.shift();
            
            try {
                this.lastRequestTime = Date.now();
                const result = await requestFn();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }

        this.isProcessing = false;
    }
}

// Export singleton instance with default configuration
export const requestQueue = new RequestQueue(
    parseInt(process.env.REQUEST_DELAY_MS, 10) || 5000
);
