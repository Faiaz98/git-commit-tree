// src/utils/PrivacyUtils.js
class PrivacyUtils {
    static detectAndScrubPII(text) {
        const piiPatterns = {
            email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
            ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
            creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
            ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g
        };

        let scrubbedText = text;
        const detectedPII = [];

        for (const [type, pattern] of Object.entries(piiPatterns)) {
            const matches = text.match(pattern);
            if (matches) {
                detectedPII.push({ type, count: matches.length });
                scrubbedText = scrubbedText.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
            }
        }

        return {
            scrubbedText,
            detectedPII,
            hasPII: detectedPII.length > 0
        };
    }

    static anonymizeAuthor(author) {
        // Replace real names with consistent pseudonyms
        const hash = this.simpleHash(author.name + author.email);
        return {
            name: `Contributor_${hash.slice(0, 6)}`,
            email: `${hash.slice(0, 8)}@anonymous.dev`,
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${hash}`
        };
    }

    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }
}