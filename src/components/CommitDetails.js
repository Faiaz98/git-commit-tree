import React from 'react';
import { 
  Hash, 
  User, 
  Calendar, 
  ExternalLink, 
  GitCommit,
  FileText,
  Plus,
  Minus
} from 'lucide-react';
import GitTreeUtils from '../utils/GitTreeUtils';

const CommitDetails = ({ commit, repository }) => {
  if (!commit) {
    return (
      <div className="text-center text-slate-400 py-8">
        <GitCommit className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Click on a commit node to view details</p>
      </div>
    );
  }

  const stats = GitTreeUtils.getCommitStats(commit);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Commit Details</h3>
      </div>
      
      {/* Branch indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: commit.color }}
        />
        <span className="text-sm font-mono text-slate-300">{commit.branchName}</span>
      </div>

      {/* Commit message */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <h4 className="font-medium text-white text-sm leading-relaxed">
          {commit.message || 'No commit message'}
        </h4>
      </div>

      {/* Commit hash */}
      <div className="flex items-center gap-2 text-sm">
        <Hash className="w-4 h-4 text-slate-400" />
        <code className="bg-slate-700 px-2 py-1 rounded font-mono text-xs">
          {commit.sha ? commit.sha.substring(0, 7) : 'unknown'}
        </code>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <User className="w-4 h-4" />
        <span>{commit.author?.name || 'Unknown author'}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Calendar className="w-4 h-4" />
        <span>{GitTreeUtils.formatDate(commit.date)}</span>
      </div>

      {/* Stats */}
      {(stats.additions > 0 || stats.deletions > 0) && (
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Changes</span>
            <span className="text-xs text-slate-500">{stats.total} total</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Plus className="w-3 h-3 text-green-400" />
              <span className="text-green-400">{stats.additions}</span>
            </div>
            <div className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-red-400" />
              <span className="text-red-400">{stats.deletions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Files changed */}
      {commit.files && commit.files.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Files Changed ({commit.files.length})
          </h5>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {commit.files.slice(0, 5).map((file, index) => {
              const { icon: StatusIcon, color } = GitTreeUtils.getFileStatus(file);
              return (
                <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <StatusIcon className={`w-3 h-3 ${color}`} />
                    <span className="font-mono truncate">{file.filename || file.name}</span>
                  </div>
                  {file.additions !== undefined && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-400">+{file.additions}</span>
                      <span className="text-red-400">-{file.deletions}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {commit.files.length > 5 && (
              <div className="text-xs text-slate-400 text-center py-1">
                ... and {commit.files.length - 5} more files
              </div>
            )}
          </div>
        </div>
      )}

      {/* GitHub link */}
      {repository && commit.sha && (
        <div className="pt-2 border-t border-slate-700">
          <a
            href={`https://github.com/${repository.owner}/${repository.repo}/commit/${commit.sha}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200 w-full justify-center"
          >
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      )}
    </div>
  );
};

export default CommitDetails;