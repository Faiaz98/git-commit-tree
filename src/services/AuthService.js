// src/services/AuthService.js
class AuthService {
    constructor() {
        this.clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
        this.redirectUri = process.env.REACT_APP_REDIRECT_URI;
    }

    async initiateGitHubOAuth() {
        const state = this.generateSecureState();
        sessionStorage.setItem('oauth_state', state);

        const authUrl = new URL('https://github.com/login/oauth/authorize');
        authUrl.searchParams.set('client_id', this.clientId);
        authUrl.searchParams.set('redirect_uri', this.redirectUri);
        authUrl.searchParams.set('scope', 'repo read:user');
        authUrl.searchParams.set('state', state);

        window.location.href = authUrl.toString();
    }

    async handleOAuthCallback(code, state) {
        // Verify state parameter to prevent CSRF
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
            throw new Error('Invalid state parameter - possible CSRF attack');
        }

        // Exchange code for token (must be done on backend)
        const tokenResponse = await fetch('/api/auth/github/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, state })
        });

        const { access_token } = await tokenResponse.json();
        this.storeTokenSecurely(access_token);
    }

    storeTokenSecurely(token) {
        // Never store in localStorage - use httpOnly cookies
        // This should be handled by your backend
        document.cookie = `github_token=${token}; HttpOnly; Secure; SameSite=Strict`;
    }
}