import React from 'react';
import TrendChart from './TrendChart';

const MetricCard = ({ label, value, unit, trend, thresholdType, chartData, color = 'var(--accent-cyan)' }) => {
  
  const getStatus = () => {
    const val = parseFloat(value);
    if (thresholdType === 'leadTime') {
      if (val < 48) return { label: 'On Track', class: 'badge-cyan' };
      if (val <= 120) return { label: 'Watch', class: 'badge-yellow' };
      return { label: 'At Risk', class: 'badge-magenta' };
    }
    if (thresholdType === 'cycleTime') {
      if (val < 72) return { label: 'On Track', class: 'badge-cyan' };
      if (val <= 168) return { label: 'Watch', class: 'badge-yellow' };
      return { label: 'At Risk', class: 'badge-magenta' };
    }
    if (thresholdType === 'bugRate') {
      if (val < 10) return { label: 'On Track', class: 'badge-cyan' };
      if (val <= 20) return { label: 'Watch', class: 'badge-yellow' };
      return { label: 'At Risk', class: 'badge-magenta' };
    }
    if (thresholdType === 'deployFreq') {
      if (val > 8) return { label: 'On Track', class: 'badge-cyan' };
      if (val >= 4) return { label: 'Watch', class: 'badge-yellow' };
      return { label: 'At Risk', class: 'badge-magenta' };
    }
    if (thresholdType === 'prThroughput') {
      if (val > 10) return { label: 'On Track', class: 'badge-cyan' };
      if (val >= 5) return { label: 'Watch', class: 'badge-yellow' };
      return { label: 'At Risk', class: 'badge-magenta' };
    }
    return null;
  };

  const status = getStatus();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div className="metric-label">{label}</div>
        {status && <span className={`badge ${status.class}`} style={{ fontSize: '0.65rem' }}>{status.label}</span>}
      </div>
      
      <div className="metric-value">
        {value}
        <span style={{ fontSize: '1rem', marginLeft: '4px', color: 'var(--text-secondary)' }}>{unit}</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          color: trend < 0 ? 'var(--accent-cyan)' : 'var(--accent-magenta)',
          fontWeight: '600'
        }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
        </span>
      </div>

      <TrendChart data={chartData} color={color} />
    </div>
  );
};

export default MetricCard;
