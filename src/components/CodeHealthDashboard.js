// src/components/CodeHealthDashboard.js
const CodeHealthDashboard = ({ repository, commits }) => {
  const [metrics, setMetrics] = useState({
    commitFrequency: 0,
    authorDiversity: 0,
    branchComplexity: 0,
    technicalDebt: 0,
    testCoverage: null
  });

  const calculateHealthScore = () => {
    const weights = {
      commitFrequency: 0.2,
      authorDiversity: 0.3,
      branchComplexity: -0.1, // Negative weight
      technicalDebt: -0.4
    };
    
    return Object.entries(weights).reduce((score, [metric, weight]) => 
      score + (metrics[metric] * weight), 0
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard 
        title="Commit Frequency" 
        value={`${metrics.commitFrequency}/week`}
        trend="up"
        description="Regular commits indicate active development"
      />
      <MetricCard 
        title="Author Diversity" 
        value={`${metrics.authorDiversity} contributors`}
        trend="stable"
        description="Multiple contributors reduce bus factor"
      />
      <MetricCard 
        title="Branch Complexity" 
        value={metrics.branchComplexity}
        trend="down"
        description="Simpler branching strategies are easier to manage"
      />
      <MetricCard 
        title="Overall Health" 
        value={`${Math.round(calculateHealthScore() * 100)}/100`}
        trend={calculateHealthScore() > 0.7 ? 'up' : 'down'}
        description="Composite health score"
      />
    </div>
  );
};