# Git Commit Tree Visualizer

A beautiful, interactive web application that visualizes GitHub repository commit histories as animated tree structures, Built with React, D3.js, and modern technologies.

![home page](image.png)
![facebook/react](image-1.png)
![Faiaz/git-commit-tree](image-2.png)
![details](image-3.png)

## Features

 - Interactive Tree Visualization: Beautiful D3.js powered commit trees with smooth animations
 - Modern UI: Glassmorphism design with responsive layouts using TailwindCSS
 - GitHub Integration: Connect to any public GitHub repository via REST API
 - Real-time Data: Live commit history, branch information, and file statistics
 - Smart Error Handling: Comprehensive error messages with actionable solutions
 - Click Interactions: Click commit nodes to view detailed information
 - Responsive Design: Works seamlessly on desktop, tablet, and mobile devices
 - Performance Optimized: Efficient data processing and smooth 60fps animations


 ## Example repos to test:

 - `facebook/react`
 - `microsoft/typescript`
 - `vercel/next.js`
 - `tailwindcss/tailwindcss`

 ## ScreenShots

 ### Main Interface
 ![home page](image.png)

 ### Commit Details
 ![details](image-3.png)

 ### Branch Visualization
 ![details](image-3.png)


 ## Tech Stack

 - Frontend Framework: React 18.2.0
 - Visualization: D3.js 7.8.5
 - Styling: TailwindCSS 3.3.0
 - API: GitHub REST API v3
 - Build Tool: Create React App
 - Language: JavaScript (ES6+)

 ## Installation

 ### Prerequisites
  - Node.js 16.0.0 or higher
  - npm 7.0.0 or higher
  - Git

### Quick Start

1. Clone the repo

```bash
git clone https://github.com/Faiaz98/git-commit-tree.git
cd git-commit-tree
```

2. Install dependencies

```bash
npm install
```

3. Set up the env variables

```bash
cp .env.example .env
```
Edit `.env` and add your GitHub personal access token:

```env
REACT_APP_GITHUB_TOKEN=your_github_token_here
REACT_APP_CORS_PROXY=https://cors-anywhere.herokuapp.com
```

4. Start the development server

```bash
npm start
```

5. Open your browser Navigate to `http://localhost:3000`

## Product Build

```bash
npm run build
npm run serve
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# GitHub Personal Access Token (recommended for higher rate limits)
REACT_APP_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# CORS Proxy URL (required for browser-based requests)
REACT_APP_CORS_PROXY=https://cors-anywhere.herokuapp.com

# Optional: Custom GitHub API base URL
REACT_APP_GITHUB_API_URL=https://api.github.com
```

### Getting a GitHub Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes:

 - `public_repo` (for public repositories)
 - `repo` (for private repositories, if needed)


Copy the generated token to your `.env` file

### CORS Configuration

Due to browser security policies, direct requests to GitHub's API are blocked by CORS. Choose one solution:

**Option 1: CORS Proxy (Development)**

```env
REACT_APP_CORS_PROXY=https://cors-anywhere.herokuapp.com
```

**Option 2: Backend Proxy (Production)**

Set up an Express.js proxy server:

```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/api/github', createProxyMiddleware({
  target: 'https://api.github.com',
  changeOrigin: true,
  pathRewrite: { '^/api/github': '' },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Authorization', `token ${process.env.GITHUB_TOKEN}`);
  }
}));

app.listen(3001);
```

**Option 3: GitHub GraphQL API**
Use GitHub's GraphQL endpoint which has better CORS support for some use cases.


## Advanced Features
### Repository Input Formats

 - owner/repo (e.g., facebook/react)
 - github.com/owner/repo
 - https://github.com/owner/repo
 - https://github.com/owner/repo.git

### Keyboard Shortcuts

 - Enter in input field: Submit repository
 - Escape: Clear error messages

### Mouse Interactions

 - Click node: View commit details
 - Hover node: Preview commit information
 - Scroll: Navigate large repository trees


## API Reference

### GitHubService Methods

```js
// Initialize service
const github = new GitHubService(token, corsProxy);

// Get repository information
const repo = await github.getRepository('facebook', 'react');

// Get repository branches
const branches = await github.getBranches('facebook', 'react');

// Get commit history
const commits = await github.getCommits('facebook', 'react', 'main', 30);

// Get detailed commit information
const commit = await github.getCommitDetails('facebook', 'react', 'abc123');

// Test API connection
const status = await github.testConnection();
```

### Data Structures

**Repository Object**

```js
{
  owner: "facebook",
  repo: "react", 
  info: {
    full_name: "facebook/react",
    description: "A declarative, efficient...",
    html_url: "https://github.com/facebook/react",
    stargazers_count: 219000,
    forks_count: 45000
  }
}
```

**Commit Object**

```js
{
  sha: "a1b2c3d4e5f6",
  message: "Fix memory leak in useEffect",
  author: {
    name: "John Doe",
    date: "2024-08-15T10:30:00Z"
  },
  branch: "main",
  stats: {
    additions: 25,
    deletions: 10,
    total: 35
  },
  files: [...]
}
```

## Customization

**Styling**

The project uses TailwindCSS for styling. Customize the theme in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out'
      }
    }
  }
}
```

**Branch Colors**

Modify branch colors in `GitTreeUtils.js`:

```js
static getBranchColor(index) {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    // Add your custom colors
  ];
  return colors[index % colors.length];
}
```

**Animation Timing**
Adjust D3.js animations in `TreeVisualization.js`:

```js
.transition()
.duration(600)        // Animation duration
.delay((d, i) => i * 100)  // Stagger delay
.ease(d3.easeElasticOut)   // Easing function
```

## Contributing
We welcome contributions! Please read our contributing guidelines before submitting PRs.
Development Setup

1. Fork the repository
2. Create a feature branch: git checkout -b feature/amazing-feature
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: npm test
6. Commit with conventional commits: git commit -m "feat: add amazing feature"
7. Push to your fork: git push origin feature/amazing-feature
8. Submit a Pull Request

## Code Standards

 - Use ESLint and Prettier configurations
 - Write meaningful commit messages
 - Add JSDoc comments for functions
 - Include tests for new features
 - Follow React best practices

## Issue Reports
When reporting bugs, please include:

 - Browser and version
 - Steps to reproduce
 - Expected vs actual behavior
 - Error messages/screenshots
 - Repository URL that caused the issue

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

 - GitHub API for providing comprehensive repository data
 - D3.js for powerful data visualization capabilities
 - React Team for the excellent frontend framework
 - Tailwind Labs for the utility-first CSS framework
 - Lucide for beautiful, consistent icons
 - Create React App for the development setup