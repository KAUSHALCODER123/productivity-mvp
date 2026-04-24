export const generateStory = (metrics) => {
  const { leadTime, cycleTime, bugRate, deployFreq, prThroughput } = metrics;
  let story = "";
  let nextSteps = [];

  // Logic for the Narrative
  if (parseFloat(leadTime) > parseFloat(cycleTime) * 1.5) {
    story += `Your Lead Time for Changes (${leadTime}h) is significantly higher than your Cycle Time (${cycleTime}h). This indicates that while you are coding quickly, your work is getting stuck in the PR review or deployment queue. `;
    nextSteps.push("Identify if PR reviews are taking too long or if the CI/CD pipeline is slow.");
  } else {
    story += `Your delivery pipeline is well-balanced. Lead Time (${leadTime}h) and Cycle Time (${cycleTime}h) are moving in sync, which is a sign of a healthy SDLC. `;
  }

  if (parseFloat(bugRate) > 15) {
    story += `The current Bug Rate (${bugRate}%) is above the team threshold. We've noticed a pattern of post-release issues that could suggest a need for more robust local testing or unit test coverage. `;
    nextSteps.push("Review recent bug reports to identify common 'leakage' points in your workflow.");
  } else {
    story += `Your quality remains high with a Bug Rate of only ${bugRate}%, well below the 10% target. `;
  }

  if (prThroughput < 5) {
    story += `PR Throughput is lower than usual this month. This might be due to working on high-complexity tasks or unexpected blockers. `;
    nextSteps.push("Break down larger Jira tickets into smaller PRs to increase throughput and reduce risk.");
  } else {
    story += `Your throughput is excellent, with ${prThroughput} merged PRs this month. `;
  }

  // Fallback next steps if none generated
  if (nextSteps.length === 0) {
    nextSteps.push("Maintain current velocity and quality standards.");
    nextSteps.push("Experiment with a new automation tool to shave off more Lead Time.");
  }

  return { story, nextSteps };
};
