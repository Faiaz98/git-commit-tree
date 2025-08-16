// src/utils/SecurityUtils.js
class SecurityUtils {
    static validateRepositoryUrl(url) {
        // Comprehensive URL validation
        const validPatterns = [
            /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/, // Simple owner/repo
            /^github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/, // With domain
            /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/ // Full URL
        ];

        // Check against malicious patterns
        const maliciousPatterns = [
            /<script/i,
            /javascript:/i,
            /data:/i,
            /vbscript:/i,
            /on\w+=/i
        ];

        // Validate format
        const isValidFormat = validPatterns.some(pattern => pattern.test(url));
        if (!isValidFormat) {
            throw new Error('Invalid repository URL format');
        }

        // Check for malicious content
        const isMalicious = maliciousPatterns.some(pattern => pattern.test(url));
        if (isMalicious) {
            throw new Error('Potentially malicious URL detected');
        }

        // URL length limits
        if (url.length > 200) {
            throw new Error('URL too long');
        }

        return true;
    }

    static sanitizeCommitMessage(message) {
        // Prevent XSS in commit messages
        return message
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    static validateApiResponse(data, expectedShape) {
        // Validate API responses match expected structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid API response format');
        }

        // Check for expected fields
        for (const field of expectedShape) {
            if (!(field in data)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        return true;
    }
}