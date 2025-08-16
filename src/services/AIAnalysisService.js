// src/services/AIAnalysisService.js
class AIAnalysisService {
    static async analyzeCommitPatterns(commits) {
        // Integrate with OpenAI or similar for pattern analysis
        const patterns = {
            commitTypes: this.categorizeCommits(commits),
            riskFactors: this.identifyRiskFactors(commits),
            suggestions: await this.generateSuggestions(commits)
        };
        return patterns;
    }

    static categorizeCommits(commits) {
        return commits.map(commit => ({
            ...commit,
            type: this.detectCommitType(commit.message),
            sentiment: this.analyzeSentiment(commit.message),
            complexity: this.assessComplexity(commit)
        }));
    }

    static detectCommitType(message) {
        const patterns = {
            feat: /^(feat|feature):/i,
            fix: /^(fix|hotfix|bugfix):/i,
            docs: /^docs?:/i,
            style: /^style:/i,
            refactor: /^refactor:/i,
            test: /^test:/i,
            chore: /^chore:/i
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(message)) return type;
        }
        return 'other';
    }
}