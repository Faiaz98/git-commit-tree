// src/components/TeamInsights.js
const TeamInsights = ({ commits, teamMembers }) => {
  const insights = useMemo(() => ({
    topContributors: getTopContributors(commits),
    collaborationNetwork: buildCollaborationGraph(commits),
    workPatterns: analyzeWorkPatterns(commits),
    knowledgeDistribution: assessKnowledgeDistribution(commits)
  }), [commits, teamMembers]);

  return (
    <div className="space-y-6">
      <ContributorLeaderboard contributors={insights.topContributors} />
      <CollaborationGraph network={insights.collaborationNetwork} />
      <WorkPatternChart patterns={insights.workPatterns} />
      <KnowledgeMap distribution={insights.knowledgeDistribution} />
    </div>
  );
};