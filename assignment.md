Intern Assignment - Developer Productivity MVP
Goal: evaluate product thinking, basic full-stack engineering, data handling, and responsible AI use through a small but
thoughtful developer productivity prototype.
Important: this is not a generic dashboard assignment. A focused MVP that you can explain clearly is stronger than a
broad unfinished product.
AI is allowed and encouraged
Use AI to understand the domain, summarize the workbook, brainstorm architecture, generate scaffolding, debug
issues, write tests, and practice your explanation. Keep only what you understand and can defend in the interview.
Good AI use: ask better questions, verify metric logic, compare options, and improve clarity. Bad AI use: submitting
code or reasoning that you cannot explain.
1. Problem context
Developers and managers can often see metrics such as lead time, cycle time, deployment frequency, bug rate, and
PR throughput. The problem is that metrics alone do not explain what is happening or what the user should do next.
Your MVP should help a developer move from raw metrics to better understanding and better action.
2. What you are expected to build
Build a small full-stack MVP using React.js on the front end. The recommended path is to start with one Individual
Contributor view: show current metrics, interpret the likely story behind those metrics, and suggest one or two practical
next steps. If time permits, add a lightweight manager summary page.
You may choose any reasonable backend, mock API, or data store. We care more about the clarity of your choices than
about heavy infrastructure.
3. Developer productivity mini-brief
Term Meaning
Developer A person who builds, changes, reviews, tests, and ships software.
SDLC Software Development Life Cycle: plan work, build, review, test, deploy, and fix issues after release.
Why metrics exist To understand bottlenecks, quality, and delivery health - not to judge blindly.
4. The 5 metrics in this assignment
Metric Simple definition used in this assignment
Lead Time for Changes Average time from PR opened to successful production deployment.
Cycle Time Average time from issue moved to In Progress to issue marked Done.
Bug Rate Escaped production bugs found in the month divided by issues completed in the month.
Deployment Frequency Count of successful production deployments in the month.
PR Throughput Count of merged pull requests in the month.
Use the workbook definitions even if internet sources define these metrics differently. The assignment uses simplified logic so
you can focus on product and software design.
5. Source data provided to you
The workbook contains clean sample source tables that act like separate systems: developer dimension data, Jira-like
issue data, pull-request data, CI/CD deployment data, and post-release bug data. It also includes a metric example
sheet showing one simple way to calculate the assignment metrics.
6. Recommended approach
• Read the workbook context sheets first: Start_Here, Developer_Productivity_Brief, and Metric_Examples.
•
Inspect the source tables and decide which fields you will actually use in your MVP.
• Pick one focused user journey. Recommended: IC profile -> interpretation -> next steps.
• Use AI to accelerate research, architecture, coding, debugging, and explanation practice.
• Build the MVP with React.js on the front end and any sensible backend or API approach.
• Create a Miro board using the free User Journey template.
• Record a 5-10 minute demo video and show a brief working prototype.
7. Suggested AI prompts
Use case Prompt to try
Understand the problem Read this assignment and explain the real user problem in simple words before suggesting any solution.
Understand the data Summarize what each source table means and how the 5 metrics could be calculated from it.
Plan the MVP Propose a small React MVP for one IC user journey with a simple backend and explain why that scope is enough.
Prepare for interview Ask me 10 follow-up questions about my design so I can practice explaining my choices without reading notes.
8. Deliverables
Deliverable Requirement
Video walkthrough 5-10 minutes, clear lighting and clear audio, uploaded to Google Drive.
Video access Open the link in incognito before submission to confirm we can view it.
Miro board Use the free Miro template called User Journey. You will walk through it in the interview.
Prototype glimpse Show the working prototype briefly in the video.
Code link Optional but strongly recommended.
9. What we will evaluate
Category Weight
Problem understanding 20%
Product thinking 20%
Frontend quality 15%
Backend / data handling 15%
Communication 15%
Responsible AI use 15%