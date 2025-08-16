import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  AlertCircle,
  ExternalLink,
  Activity
} from 'lucide-react';

import GitHubService from '../services/GitHubService';
import GitTreeUtils from '../utils/GitTreeUtils';
import RepoInput from './RepoInput';
import ErrorDisplay from './ErrorDisplay';
import CommitDetails from './CommitDetails';
import TreeVisualization from './TreeVisualization';

const GitCommitTree = () => {
  const [repository, setRepository] = useState(null);
  const [commits, setCommits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  const githubService = new GitHubService();

  const loadRepository = async (repoUrl) => {
    const parsedRepo = GitTreeUtils.parseRepoUrl(repoUrl);
    if (!parsedRepo) {
      setError('Invalid repository URL format');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedCommit(null);
    setApiStatus('Connecting to GitHub API...');

    try {
      // Test API connection first
      const connectionTest = await githubService.testConnection();
      if (!connectionTest.success) {
        throw new Error(connectionTest.message);
      }

      setApiStatus('Loading repository information...');
      
      // Load repository info
      const repoInfo = await githubService.getRepository(parsedRepo.owner, parsedRepo.repo);
      setRepository({ ...parsedRepo, info: repoInfo });

      setApiStatus('Fetching branches...');
      
      // Load branches
      const branchesData = await githubService.getBranches(parsedRepo.owner, parsedRepo.repo);
      const processedBranches = branchesData.slice(0, 5).map((branch, index) => ({
        name: branch.name,
        color: GitTreeUtils.getBranchColor(index),
        lastCommit: branch.commit
      }));
      setBranches(processedBranches);

      setApiStatus('Loading commit history...');
      
      // Load commits for each branch (limit to first 3 branches for performance)
      const allCommits = [];
      for (let i = 0; i < Math.min(processedBranches.length, 3); i++) {
        const branch = processedBranches[i];
        try {
          const branchCommits = await githubService.getCommits(
            parsedRepo.owner, 
            parsedRepo.repo, 
            branch.name, 
            15 // Limit commits per branch
          );
          
          const processedCommits = branchCommits.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message.split('\n')[0], // First line only
            author: commit.commit.author,
            date: commit.commit.author.date,
            branch: branch.name,
            url: commit.html_url,
            stats: commit.stats,
            parents: commit.parents || []
          }));
          
          allCommits.push(...processedCommits);
        } catch (branchError) {
          console.warn(`Failed to load commits for branch ${branch.name}:`, branchError);
        }
      }

      setCommits(allCommits);
      
      // Transform data for D3
      const transformedData = GitTreeUtils.transformCommitsToD3Data(processedBranches, allCommits);
      setTreeData(transformedData);
      
      setApiStatus(null);

    } catch (err) {
      console.error('Repository loading error:', err);
      setError(err.message);
      setApiStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitClick = async (commit) => {
    setSelectedCommit(commit);
    
    // Load detailed commit info if not already loaded
    if (repository && !commit.files) {
      try {
        const detailedCommit = await githubService.getCommitDetails(
          repository.owner, 
          repository.repo, 
          commit.sha
        );
        
        setSelectedCommit({
          ...commit,
          files: detailedCommit.files || [],
          stats: detailedCommit.stats || commit.stats
        });
      } catch (err) {
        console.warn('Failed to load detailed commit info:', err);
        // Keep the basic commit info even if detailed loading fails
      }
    }
  };

  const handleRetry = () => {
    if (repository) {
      loadRepository(`${repository.owner}/${repository.repo}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-xl shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <GitBranch className="w-8 h-8 text-blue-400" />
          Git Commit Tree Visualizer
        </h1>
        <p className="text-slate-300">
          Connect to any GitHub repository and visualize its commit history in real-time
        </p>
      </div>

      {/* Repository Input */}
      <div className="mb-6">
        <RepoInput onRepoSubmit={loadRepository} isLoading={isLoading} />
      </div>

      {/* Loading Status */}
      {isLoading && apiStatus && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-200">{apiStatus}</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <ErrorDisplay error={error} onRetry={handleRetry} />
        </div>
      )}

      {/* Repository Info */}
      {repository?.info && !error && (
        <div className="mb-6 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {repository.info.full_name}
                </h2>
                {repository.info.description && (
                  <p className="text-slate-300 text-sm mt-1">
                    {repository.info.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {repository.info.stargazers_count && (
                <div className="text-sm text-slate-400">
                  ⭐ {repository.info.stargazers_count.toLocaleString()}
                </div>
              )}
              <a
                href={repository.info.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Tree Visualization */}
        <div className="xl:col-span-3">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-blue-400" />
                Commit Tree Visualization
              </h2>
            </div>
            <TreeVisualization 
              data={treeData}
              onCommitClick={handleCommitClick}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Commit Details Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700 sticky top-6">
            <CommitDetails 
              commit={selectedCommit} 
              repository={repository}
            />
          </div>
        </div>
      </div>

      {/* Branch Legend */}
      {branches.length > 0 && (
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Active Branches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {branches.map((branch) => (
              <div 
                key={branch.name} 
                className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3"
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: branch.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-white truncate">
                    {branch.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {commits.filter(c => c.branch === branch.name).length} commits
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {!repository && !isLoading && !error && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            🚀 Get Started
          </h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>• Enter any public GitHub repository above (e.g., facebook/react)</p>
            <p>• For private repos or higher rate limits, add a GitHub token to .env</p>
            <p>• Click on commit nodes to see detailed information</p>
            <p>• Hover over nodes for interactive previews</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitCommitTree;