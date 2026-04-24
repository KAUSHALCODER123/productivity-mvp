export const generateStory = (metrics) => {
  const { leadTime, cycleTime, bugRate, deployFreq, prThroughput } = metrics;
  let story = "";
  let nextSteps = [];

  // Logic for the Narrative
  if (parseFloat(leadTime) > parseFloat(cycleTime) * 1.5) {
    story += `Your Lead Time for Changes (${leadTime}h) is significantly higher than your Cycle Time (${cycleTime}h). This indicates that while coding is moving fast, work is getting delayed in the review or deployment pipeline. `;
    nextSteps.push("Audit the PR review turnaround time to identify bottleneck reviewers.");
  } else {
    story += `Your delivery pipeline is well-balanced. Lead Time (${leadTime}h) and Cycle Time (${cycleTime}h) are closely aligned, showing a smooth transition from code to production. `;
  }

  if (parseFloat(bugRate) > 10) {
    story += `The current Bug Rate (${bugRate}%) is trending above our quality target. This suggests that recent complex changes might need more rigorous regression testing. `;
    nextSteps.push("Implement automated unit tests for the most frequently regressed modules.");
  } else {
    story += `Your quality remains excellent with a Bug Rate of only ${bugRate}%, well within the healthy threshold. `;
  }

  if (prThroughput < 3) {
    story += `PR Throughput (${prThroughput} merged) is currently lower than the team average. This might reflect a focus on higher-complexity architecture tasks. `;
    nextSteps.push("Break down upcoming feature requests into smaller, manageable sub-tasks.");
  } else {
    story += `Your throughput is strong, with ${prThroughput} PRs successfully merged this month. `;
  }

  // Fallback next steps if none generated
  if (nextSteps.length === 0) {
    nextSteps.push("Continue maintaining current quality and speed benchmarks.");
    nextSteps.push("Explore CI/CD optimizations to shave more minutes off Lead Time.");
  }

  return { story, nextSteps };
};
