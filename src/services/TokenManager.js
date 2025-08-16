// src/services/TokenManager.js
class TokenManager {
  static encryptToken(token, userKey) {
    // Use Web Crypto API for client-side encryption
    return crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      userKey,
      new TextEncoder().encode(token)
    );
  }

  static async validateTokenPermissions(token) {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const scopes = response.headers.get('X-OAuth-Scopes')?.split(', ') || [];
      return {
        valid: true,
        scopes,
        hasRepoAccess: scopes.includes('repo') || scopes.includes('public_repo')
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  static async revokeToken(token) {
    // Properly revoke tokens when user logs out
    await fetch(`https://api.github.com/applications/${clientId}/token`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: JSON.stringify({ access_token: token })
    });
  }
}