import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const TrendChart = ({ data, color = 'var(--accent-cyan)' }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: '40px', marginTop: '12px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#gradient-${color})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
