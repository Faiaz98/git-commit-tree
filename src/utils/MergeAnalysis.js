// src/utils/MergeAnalysis.js
class MergeAnalysis {
    static detectMergeCommits(commits) {
        return commits.filter(commit => commit.parents.length > 1);
    }

    static createMergeVisualization(commits, branches) {
        const merges = this.detectMergeCommits(commits);
        return merges.map(merge => ({
            ...merge,
            mergeType: this.getMergeType(merge),
            conflictPotential: this.assessConflictRisk(merge),
            branchesInvolved: this.getInvolvedBranches(merge, branches)
        }));
    }

    static getMergeType(commit) {
        // Fast-forward, three-way merge, squash, etc.
    }
}