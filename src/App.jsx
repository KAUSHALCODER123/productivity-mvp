import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from './components/MetricCard';
import NarrativePanel from './components/NarrativePanel';
import ManagerView from './components/ManagerView';
import SettingsForm from './components/SettingsForm';
import { generateStory } from './utils/storyEngine';
import { LayoutDashboard, Settings, User } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

function App() {
  const [view, setView] = useState('ic'); 
  const [selectedDevId, setSelectedDevId] = useState('dev_1');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Jane Developer',
    role: 'Senior Engineer'
  });
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dev_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }

    fetch('http://localhost:3001/api/metrics')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Failed to fetch data:', err));
  }, []);

  const metricsData = useMemo(() => {
    if (!data) return null;

    const { issues, pull_requests, deployments, bugs } = data;

    const calculateStats = (devId, monthStr) => {
      const devIssues = issues.filter(i => 
        (devId ? i.dev_id === devId : true) && 
        i.status === 'Done' && 
        i.done_at.includes(monthStr)
      );

      const devPrs = pull_requests.filter(pr => 
        devIssues.some(i => i.id === pr.issue_id) && 
        pr.merged_at.includes(monthStr)
      );
      
      const leadTimes = deployments
        .filter(d => d.deployed_at.includes(monthStr))
        .map(dep => {
          const prs = devPrs.filter(pr => dep.pr_ids.includes(pr.id));
          if (prs.length === 0) return null;
          return (new Date(dep.deployed_at) - new Date(prs[0].opened_at)) / (1000 * 60 * 60);
        }).filter(t => t !== null);

      const cycleTimes = devIssues.map(i => (new Date(i.done_at) - new Date(i.in_progress_at)) / (1000 * 60 * 60));
      
      const completedCount = devIssues.length;
      const bugCount = bugs.filter(b => 
        devIssues.some(i => i.id === b.issue_id) && 
        b.found_at.includes(monthStr)
      ).length;

      return {
        leadTime: leadTimes.length ? (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length) : 0,
        cycleTime: cycleTimes.length ? (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length) : 0,
        bugRate: completedCount ? (bugCount / completedCount) * 100 : 0,
        deployFreq: deployments.filter(d => 
          d.deployed_at.includes(monthStr) && 
          (devId ? d.pr_ids.some(pid => devPrs.some(p => p.id === pid)) : true)
        ).length,
        prThroughput: devPrs.length
      };
    };

    // Generate 4-week trend for sparklines
    const generateTrend = (devId, metricKey) => {
      // Mock historical weeks since our data is limited
      return [
        { week: 'W1', value: Math.random() * 50 },
        { week: 'W2', value: Math.random() * 60 },
        { week: 'W3', value: Math.random() * 40 },
        { week: 'W4', value: Math.random() * 70 }
      ];
    };

    const current = calculateStats(selectedDevId, '2026-04');
    const previous = calculateStats(selectedDevId, '2026-03');

    const getTrend = (curr, prev) => {
      if (!prev || prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const teamCurrent = calculateStats(null, '2026-04');
    const teamPrevious = calculateStats(null, '2026-03');

    return {
      icMetrics: {
        current: {
          leadTime: current.leadTime.toFixed(1),
          cycleTime: current.cycleTime.toFixed(1),
          bugRate: current.bugRate.toFixed(1),
          deployFreq: current.deployFreq,
          prThroughput: current.prThroughput
        },
        trends: {
          leadTime: getTrend(current.leadTime, previous.leadTime),
          cycleTime: getTrend(current.cycleTime, previous.cycleTime),
          bugRate: getTrend(current.bugRate, previous.bugRate),
          deployFreq: getTrend(current.deployFreq, previous.deployFreq),
          prThroughput: getTrend(current.prThroughput, previous.prThroughput)
        },
        sparklines: {
          leadTime: generateTrend(selectedDevId, 'leadTime'),
          cycleTime: generateTrend(selectedDevId, 'cycleTime'),
          bugRate: generateTrend(selectedDevId, 'bugRate'),
          deployFreq: generateTrend(selectedDevId, 'deployFreq'),
          prThroughput: generateTrend(selectedDevId, 'prThroughput')
        }
      },
      teamMetrics: {
        avgLeadTime: teamCurrent.leadTime.toFixed(1),
        avgCycleTime: teamCurrent.cycleTime.toFixed(1),
        totalThroughput: teamCurrent.prThroughput,
        avgBugRate: teamCurrent.bugRate.toFixed(1),
        trends: {
          leadTime: getTrend(teamCurrent.leadTime, teamPrevious.leadTime),
          cycleTime: getTrend(teamCurrent.cycleTime, teamPrevious.cycleTime),
          throughput: getTrend(teamCurrent.prThroughput, teamPrevious.prThroughput),
          bugRate: getTrend(teamCurrent.bugRate, teamPrevious.bugRate)
        }
      }
    };
  }, [data, selectedDevId]);

  const storyData = useMemo(() => {
    if (!metricsData) return { story: "Loading metrics...", nextSteps: [] };
    return generateStory(metricsData.icMetrics.current);
  }, [metricsData]);

  if (!data || !metricsData) {
    return <div style={{ color: '#fff', padding: '48px', textAlign: 'center' }}>Loading Insight Data...</div>;
  }

  const { icMetrics, teamMetrics } = metricsData;

  return (
    <motion.div 
      className="container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            background: 'var(--glow-cyan)', 
            padding: '12px', 
            borderRadius: '16px',
            border: '1px solid var(--accent-cyan)'
          }}>
            <LayoutDashboard color="var(--accent-cyan)" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem' }}>DevInsights <span style={{ color: 'var(--accent-magenta)' }}>MVP</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Developer Productivity Intelligence</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="view-switcher">
            <button 
              className={`view-btn ${view === 'ic' ? 'active' : ''}`}
              onClick={() => setView('ic')}
            >
              Individual
            </button>
            <button 
              className={`view-btn ${view === 'manager' ? 'active' : ''}`}
              onClick={() => setView('manager')}
            >
              Manager
            </button>
          </div>
          
          <div 
            onClick={() => setIsSettingsOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '8px 16px', 
              borderRadius: '99px', 
              background: 'rgba(255,255,255,0.05)',
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-cyan), var(--accent-magenta))' }}></div>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{userProfile.name}</span>
            <Settings size={16} color="var(--text-secondary)" />
          </div>
        </div>
      </header>

      <main>
        {view === 'ic' ? (
          <>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={20} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Select Developer:</span>
              <select 
                value={selectedDevId} 
                onChange={(e) => setSelectedDevId(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {data.developers.map(dev => (
                  <option key={dev.id} value={dev.id} style={{ background: '#0a0a14' }}>{dev.name} ({dev.role})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <motion.div className="metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }} variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <MetricCard label="Lead Time" value={icMetrics.current.leadTime} unit="hrs" trend={icMetrics.trends.leadTime} thresholdType="leadTime" chartData={icMetrics.sparklines.leadTime} color="var(--accent-cyan)" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricCard label="Cycle Time" value={icMetrics.current.cycleTime} unit="hrs" trend={icMetrics.trends.cycleTime} thresholdType="cycleTime" chartData={icMetrics.sparklines.cycleTime} color="var(--accent-magenta)" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricCard label="Bug Rate" value={icMetrics.current.bugRate} unit="%" trend={icMetrics.trends.bugRate} thresholdType="bugRate" chartData={icMetrics.sparklines.bugRate} color="#FFEB3B" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricCard label="Deploy Freq" value={icMetrics.current.deployFreq} unit="/mo" trend={icMetrics.trends.deployFreq} thresholdType="deployFreq" chartData={icMetrics.sparklines.deployFreq} color="var(--accent-cyan)" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricCard label="PR Throughput" value={icMetrics.current.prThroughput} unit="/mo" trend={icMetrics.trends.prThroughput} thresholdType="prThroughput" chartData={icMetrics.sparklines.prThroughput} color="var(--accent-magenta)" />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <NarrativePanel 
                  story={storyData.story} 
                  nextSteps={storyData.nextSteps} 
                />
              </motion.div>
            </div>
          </>
        ) : (
          <ManagerView 
            teamMetrics={teamMetrics} 
            developers={data.developers} 
            issues={data.issues}
          />
        )}
      </main>

      <SettingsForm 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={setUserProfile}
      />

      <footer style={{ marginTop: '64px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        &copy; 2026 DevInsights Productivity Tool • {userProfile.role}
      </footer>
    </motion.div>
  );
}

export default App;
