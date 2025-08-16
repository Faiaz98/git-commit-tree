// src/services/SecurityLogger.js
class SecurityLogger {
    static logSecurityEvent(event) {
        const securityEvent = {
            timestamp: new Date().toISOString(),
            type: event.type,
            severity: event.severity,
            details: event.details,
            userAgent: navigator.userAgent,
            ip: event.ip, // Should be added by backend
            sessionId: this.getSessionId()
        };

        // Send to security monitoring service
        this.sendToSecurityService(securityEvent);

        // Log locally for debugging
        if (process.env.NODE_ENV === 'development') {
            console.warn('🔒 Security Event:', securityEvent);
        }
    }

    static logSuspiciousActivity(activity) {
        this.logSecurityEvent({
            type: 'SUSPICIOUS_ACTIVITY',
            severity: 'HIGH',
            details: activity
        });
    }

    static logAuthFailure(reason) {
        this.logSecurityEvent({
            type: 'AUTH_FAILURE',
            severity: 'MEDIUM',
            details: { reason, timestamp: Date.now() }
        });
    }
}