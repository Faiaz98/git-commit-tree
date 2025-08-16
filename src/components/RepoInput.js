import React, { useState } from 'react';
import { Globe, Search, Loader } from 'lucide-react';

const RepoInput = ({ onRepoSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  const validateAndSubmit = () => {
    const trimmedUrl = repoUrl.trim();
    
    if (!trimmedUrl) {
      setError('Please enter a repository URL or name');
      return;
    }

    // Basic validation
    const validPatterns = [
      /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,  // owner/repo
      /^github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/, // github.com/owner/repo
      /^https?:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/ // full URL
    ];

    const isValid = validPatterns.some(pattern => pattern.test(trimmedUrl));
    
    if (!isValid) {
      setError('Invalid format. Use: owner/repo or github.com/owner/repo');
      return;
    }

    setError('');
    onRepoSubmit(trimmedUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value);
              if (error) setError(''); // Clear error on typing
            }}
            onKeyPress={handleKeyPress}
            placeholder="facebook/react or github.com/owner/repo"
            className={`w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors ${
              error 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-slate-600 focus:border-blue-500'
            }`}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={validateAndSubmit}
          disabled={isLoading || !repoUrl.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Visualize
            </>
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
      
      <div className="text-xs text-slate-400">
        Examples: <span className="text-blue-400">facebook/react</span>, <span className="text-blue-400">microsoft/typescript</span>
      </div>
    </div>
  );
};

export default RepoInput;