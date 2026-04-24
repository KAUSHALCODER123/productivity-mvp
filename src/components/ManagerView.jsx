import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';

const ManagerView = ({ teamMetrics, developers, issues }) => {
  const getVelocity = (devId) => {
    const devIssues = issues.filter(i => i.dev_id === devId && i.status === 'Done');
    return devIssues.length;
  };

  const maxVelocity = Math.max(...developers.map(d => getVelocity(d.id)), 1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="manager-dashboard"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Users size={24} color="var(--accent-cyan)" />
        <h2 style={{ fontSize: '1.5rem' }}>Team Performance Summary</h2>
      </div>

      <div className="metric-grid">
        <MetricCard label="Avg Lead Time" value={teamMetrics.avgLeadTime} unit="hrs" trend={teamMetrics.trends.leadTime} badge="cyan" />
        <MetricCard label="Avg Cycle Time" value={teamMetrics.avgCycleTime} unit="hrs" trend={teamMetrics.trends.cycleTime} badge="magenta" />
        <MetricCard label="Team Throughput" value={teamMetrics.totalThroughput} unit="PRs" trend={teamMetrics.trends.throughput} />
        <MetricCard label="System Bug Rate" value={teamMetrics.avgBugRate} unit="%" trend={teamMetrics.trends.bugRate} />
      </div>

      <div className="glass-card" style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <AlertCircle size={20} color="var(--accent-yellow)" />
          <h3 style={{ fontSize: '1.25rem' }}>Resource Allocation & Health</h3>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
              <th style={{ padding: '12px 0' }}>Developer</th>
              <th>Role</th>
              <th>Current Velocity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {developers.map(dev => {
              const velocity = getVelocity(dev.id);
              const percentage = (velocity / maxVelocity) * 100;
              
              return (
                <tr key={dev.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '16px 0', color: 'var(--text-primary)', fontWeight: '600' }}>{dev.name}</td>
                  <td>{dev.role}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                        <div style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: 'var(--accent-cyan)', 
                          borderRadius: '3px',
                          boxShadow: '0 0 8px var(--accent-cyan)'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', minWidth: '20px' }}>{velocity}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-cyan">Active</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManagerView;
