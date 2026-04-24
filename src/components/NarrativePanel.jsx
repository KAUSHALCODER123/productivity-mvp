import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const NarrativePanel = ({ story, nextSteps }) => {
  return (
    <div className="glass-card story-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Sparkles size={24} color="var(--accent-magenta)" />
        <h2 style={{ fontSize: '1.5rem' }}>The Story Behind Your Metrics</h2>
      </div>
      
      <div className="story-content">
        <p>{story}</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Recommended Next Steps</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nextSteps.map((step, index) => (
            <motion.div 
              key={index} 
              className="action-chip"
              whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CheckCircle2 size={18} color="var(--accent-cyan)" />
              <span style={{ flex: 1 }}>{step}</span>
              <ArrowRight size={16} color="var(--text-secondary)" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default NarrativePanel;
