import React from 'react';

const MetricCard = ({ label, value, unit, trend, badge }) => {
  return (
    <div className="glass-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value}
        <span style={{ fontSize: '1rem', marginLeft: '4px', color: 'var(--text-secondary)' }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.875rem', 
          color: trend > 0 ? 'var(--accent-magenta)' : 'var(--accent-cyan)',
          fontWeight: '600'
        }}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </span>
        {badge && <span className={`badge badge-${badge}`}>{badge}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
