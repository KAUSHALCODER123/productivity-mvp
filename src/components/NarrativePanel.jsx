import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Brain } from 'lucide-react';

const NarrativePanel = ({ story, nextSteps }) => {
  const [isThinking, setIsThinking] = useState(true);

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => setIsThinking(false), 1500);
    return () => clearTimeout(timer);
  }, [story]);

  return (
    <div className="glass-card" style={{ height: '100%', border: '1px solid rgba(162, 89, 255, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Brain size={24} color="var(--accent-magenta)" />
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Workflow Interpretation</h2>
      </div>

      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div 
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}
          >
            <div className="skeleton" style={{ height: '20px', width: '90%' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '70%' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '80%' }}></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>Analyzing SDLC metrics & identifying bottlenecks...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{ 
              lineHeight: '1.6', 
              fontSize: '1rem', 
              color: 'var(--text-primary)',
              marginBottom: '32px',
              borderLeft: '2px solid var(--accent-magenta)',
              paddingLeft: '16px'
            }}>
              {story}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Sparkles size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--accent-cyan)' }}>Practical Next Steps</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {nextSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="action-chip"
                  whileHover={{ x: 8, background: 'rgba(255,255,255,0.08)' }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <ArrowRight size={14} color="var(--accent-cyan)" />
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NarrativePanel;
