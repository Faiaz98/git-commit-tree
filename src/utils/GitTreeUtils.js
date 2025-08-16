class GitTreeUtils {
  static parseRepoUrl(url) {
    // Remove whitespace and common prefixes
    url = url.trim().replace(/^https?:\/\//, '').replace(/^github\.com\//, '');
    
    // Match patterns like: owner/repo, owner/repo.git, etc.
    const patterns = [
      /^([^\/\s]+)\/([^\/\s]+?)(?:\.git)?(?:\/.*)?$/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2]
        };
      }
    }
    return null;
  }

  static formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  static getFileStatus(file) {
    const { Plus, Minus, FileText } = require('lucide-react');
    
    switch (file.status) {
      case 'added':
        return { icon: Plus, color: 'text-green-500', label: 'Added' };
      case 'removed':
      case 'deleted':
        return { icon: Minus, color: 'text-red-500', label: 'Deleted' };
      case 'modified':
        return { icon: FileText, color: 'text-blue-500', label: 'Modified' };
      case 'renamed':
        return { icon: FileText, color: 'text-yellow-500', label: 'Renamed' };
      default:
        return { icon: FileText, color: 'text-gray-500', label: 'Changed' };
    }
  }

  static getBranchColor(index) {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#06b6d4', // cyan
      '#f97316', // orange
      '#84cc16', // lime
      '#ec4899', // pink
      '#6366f1', // indigo
    ];
    return colors[index % colors.length];
  }

  static transformCommitsToD3Data(branches, allCommits) {
    const nodes = [];
    const links = [];
    
    // Group commits by branch
    const commitsByBranch = {};
    branches.forEach(branch => {
      commitsByBranch[branch.name] = allCommits.filter(commit => 
        commit.branch === branch.name
      );
    });

    // Create nodes
    branches.forEach((branch, branchIndex) => {
      const branchCommits = commitsByBranch[branch.name] || [];
      const xPosition = branchIndex * 250 + 150;
      
      branchCommits.forEach((commit, commitIndex) => {
        const node = {
          ...commit,
          x: xPosition,
          y: commitIndex * 100 + 80,
          color: branch.color,
          branchName: branch.name
        };
        nodes.push(node);

        // Create links to parent commits
        if (commitIndex > 0) {
          const parentCommit = branchCommits[commitIndex - 1];
          if (parentCommit) {
            links.push({
              source: parentCommit.sha,
              target: commit.sha,
              color: branch.color
            });
          }
        }
      });
    });

    return { nodes, links };
  }

  static truncateMessage(message, maxLength = 50) {
    if (!message) return 'No commit message';
    return message.length > maxLength 
      ? message.substring(0, maxLength) + '...' 
      : message;
  }

  static getCommitStats(commit) {
    if (!commit.stats) {
      return { additions: 0, deletions: 0, total: 0 };
    }
    
    return {
      additions: commit.stats.additions || 0,
      deletions: commit.stats.deletions || 0,
      total: commit.stats.total || 0
    };
  }
}

export default GitTreeUtils;