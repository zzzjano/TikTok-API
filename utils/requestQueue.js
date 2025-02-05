class RequestQueue {
    constructor(minDelayMs = 5000) {
        this.queue = [];
        this.isProcessing = false;
        this.lastRequestTime = 0;
        this.minDelayMs = minDelayMs;
    }

    async add(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFn, resolve, reject });
            this.processQueue();
        });
    }

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

export const requestQueue = new RequestQueue();
