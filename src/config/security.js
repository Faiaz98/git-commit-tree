// src/config/security.js
const SecurityConfig = {
    development: {
        corsOrigins: ['http://localhost:3000'],
        allowedDomains: ['github.com', 'api.github.com'],
        tokenStorage: 'memory', // Never localStorage in prod
        logLevel: 'debug'
    },

    production: {
        corsOrigins: ['https://yourdomain.com'],
        allowedDomains: ['github.com', 'api.github.com'],
        tokenStorage: 'httpOnlyCookie',
        logLevel: 'error',
        enableCSP: true,
        contentSecurityPolicy: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.github.com"]
        }
    }
};

export default SecurityConfig[process.env.NODE_ENV || 'development'];