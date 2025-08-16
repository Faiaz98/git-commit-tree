import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry, showSolutions = true }) => {
  const getSolutionForError = (errorMessage) => {
    if (errorMessage.includes('CORS')) {
      return {
        title: 'CORS Issue',
        solutions: [
          'Add a CORS proxy URL to your .env file',
          'Set up a backend API to proxy GitHub requests',
          'Use GitHub\'s GraphQL API which has better CORS support'
        ]
      };
    }
    
    if (errorMessage.includes('Rate limit')) {
      return {
        title: 'Rate Limit Exceeded',
        solutions: [
          'Add a GitHub Personal Access Token to .env',
          'Wait for rate limit to reset (usually 1 hour)',
          'Use authenticated requests for higher limits'
        ]
      };
    }
    
    if (errorMessage.includes('not found')) {
      return {
        title: 'Repository Not Found',
        solutions: [
          'Check the repository name spelling',
          'Ensure the repository is public',
          'Verify the owner/organization name'
        ]
      };
    }
    
    return {
      title: 'API Error',
      solutions: [
        'Check your internet connection',
        'Verify the repository exists and is public',
        'Try again in a few moments'
      ]
    };
  };

  const solution = getSolutionForError(error);

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            {solution.title}
          </h3>
          <p className="text-red-200 mb-4 text-sm">
            {error}
          </p>
          
          {showSolutions && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Possible Solutions:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                {solution.solutions.map((sol, index) => (
                  <li key={index}>{sol}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;