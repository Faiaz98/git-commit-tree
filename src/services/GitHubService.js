class GitHubService {
  constructor(token = null, corsProxy = null) {
    this.baseURL = 'https://api.github.com';
    this.token = token || process.env.REACT_APP_GITHUB_TOKEN;
    this.corsProxy = corsProxy || process.env.REACT_APP_CORS_PROXY;
  }

  getApiUrl(endpoint) {
    const fullUrl = `${this.baseURL}${endpoint}`;
    // Use CORS proxy if available
    return this.corsProxy ? `${this.corsProxy}/${fullUrl}` : fullUrl;
  }

  async fetchWithAuth(endpoint) {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Git-Commit-Tree-Visualizer',
    };
    
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const url = this.getApiUrl(endpoint);
    
    try {
      const response = await fetch(url, { 
        headers,
        method: 'GET',
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please add a GitHub token or try again later.');
        }
        if (response.status === 404) {
          throw new Error('Repository not found. Please check the repository name.');
        }
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('CORS error: Unable to connect to GitHub API directly. Please set up a CORS proxy or backend service.');
      }
      throw error;
    }
  }

  async getRepository(owner, repo) {
    return this.fetchWithAuth(`/repos/${owner}/${repo}`);
  }

  async getBranches(owner, repo, perPage = 10) {
    return this.fetchWithAuth(`/repos/${owner}/${repo}/branches?per_page=${perPage}`);
  }

  async getCommits(owner, repo, branch = 'main', perPage = 30, page = 1) {
    const endpoint = `/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${perPage}&page=${page}`;
    return this.fetchWithAuth(endpoint);
  }

  async getCommitDetails(owner, repo, sha) {
    return this.fetchWithAuth(`/repos/${owner}/${repo}/commits/${sha}`);
  }

  async getRateLimit() {
    return this.fetchWithAuth('/rate_limit');
  }

  // Helper method to test API connection
  async testConnection() {
    try {
      await this.getRateLimit();
      return { success: true, message: 'Connected to GitHub API successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default GitHubService;