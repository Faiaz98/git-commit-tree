// src/services/RateLimiter.js
class RateLimiter {
    constructor(maxRequests = 60, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = new Map();
    }

    canMakeRequest(identifier = 'default') {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Get existing requests for this identifier
        let userRequests = this.requests.get(identifier) || [];

        // Remove old requests outside the window
        userRequests = userRequests.filter(timestamp => timestamp > windowStart);

        // Check if limit exceeded
        if (userRequests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...userRequests);
            const waitTime = oldestRequest + this.windowMs - now;
            throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime/1000)} seconds`);
        }

        // Add current request
        userRequests.push(now);
        this.requests.set(identifier, userRequests);

        return true;
    }

    getRemainingRequests(identifier = 'default') {
        const userRequests = this.requests.get(identifier) || [];
        const now = Date.now();
        const windowStart = now - this.windowMs;
        const activeRequests = userRequests.filter(timestamp => timestamp > windowStart);

        return Math.max(0, this.maxRequests - activeRequests.length);
    }
}