import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mockData from './data/mockData.json';
import MetricCard from './components/MetricCard';
import NarrativePanel from './components/NarrativePanel';
import ManagerView from './components/ManagerView';
import SettingsForm from './components/SettingsForm';
import { generateStory } from './utils/storyEngine';
import { LayoutDashboard, Settings } from 'lucide-react';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Jane Developer',
    role: 'Senior Engineer'
  });

  useEffect(() => {
    const saved = localStorage.getItem('dev_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const { icMetrics, teamMetrics } = useMemo(() => {
    const { issues, pull_requests, deployments, bugs } = mockData;

    const calculateForDev = (devId) => {
      const devIssues = issues.filter(i => i.dev_id === devId && i.status === 'Done');
      const devPrs = pull_requests.filter(pr => devIssues.some(i => i.id === pr.issue_id));
      
      const leadTimes = deployments.map(dep => {
        const prs = devPrs.filter(pr => dep.pr_ids.includes(pr.id));
        if (prs.length === 0) return null;
        return (new Date(dep.deployed_at) - new Date(prs[0].opened_at)) / (1000 * 60 * 60);
      }).filter(t => t !== null);

      const cycleTimes = devIssues.map(i => (new Date(i.done_at) - new Date(i.in_progress_at)) / (1000 * 60 * 60));
      
      return {
        leadTime: (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length || 0).toFixed(1),
        cycleTime: (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length || 0).toFixed(1),
        bugRate: ((bugs.filter(b => devIssues.some(i => i.id === b.issue_id)).length / devIssues.length) * 100).toFixed(1),
        deployFreq: deployments.filter(d => d.pr_ids.some(pid => devPrs.some(p => p.id === pid))).length,
        prThroughput: devPrs.length
      };
    };

    const allCompletedIssues = issues.filter(i => i.status === 'Done');
    const teamCycleTimes = allCompletedIssues.map(i => (new Date(i.done_at) - new Date(i.in_progress_at)) / (1000 * 60 * 60));
    
    return {
      icMetrics: calculateForDev('dev_1'),
      teamMetrics: {
        avgLeadTime: 22.4,
        avgCycleTime: (teamCycleTimes.reduce((a, b) => a + b, 0) / teamCycleTimes.length).toFixed(1),
        totalThroughput: pull_requests.length,
        avgBugRate: ((bugs.length / allCompletedIssues.length) * 100).toFixed(1)
      }
    };
  }, []);

  const storyData = useMemo(() => generateStory(icMetrics), [icMetrics]);

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
            <motion.div className="metric-grid" variants={containerVariants}>
              <motion.div variants={itemVariants}><MetricCard label="Lead Time" value={icMetrics.leadTime} unit="hrs" trend={-12} badge="cyan" /></motion.div>
              <motion.div variants={itemVariants}><MetricCard label="Cycle Time" value={icMetrics.cycleTime} unit="hrs" trend={5} badge="magenta" /></motion.div>
              <motion.div variants={itemVariants}><MetricCard label="Bug Rate" value={icMetrics.bugRate} unit="%" trend={20} /></motion.div>
              <motion.div variants={itemVariants}><MetricCard label="Deploy Freq" value={icMetrics.deployFreq} unit="/mo" trend={-10} badge="cyan" /></motion.div>
              <motion.div variants={itemVariants}><MetricCard label="PR Throughput" value={icMetrics.prThroughput} unit="/mo" trend={15} /></motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NarrativePanel 
                story={storyData.story} 
                nextSteps={storyData.nextSteps} 
              />
            </motion.div>
          </>
        ) : (
          <ManagerView 
            teamMetrics={teamMetrics} 
            developers={mockData.developers} 
          />
        )}
      </main>

      <SettingsForm 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={setUserProfile}
      />

      <footer style={{ marginTop: '64px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        &copy; 2024 DevInsights Productivity Tool • {userProfile.role}
      </footer>
    </motion.div>
  );
}

export default App;



