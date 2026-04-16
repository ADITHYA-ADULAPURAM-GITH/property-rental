import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, trendLabel, color = 'var(--primary)', delay = 0 }) => {
  return (
    <div 
      className="glass-panel stat-card" 
      style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        animation: `fadeIn 0.5s ease-out ${delay}s forwards`,
        opacity: 0
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>
            {title}
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
            {value}
          </div>
        </div>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: 'var(--radius-md)', 
          background: `rgba(${hexToRgb(color)}, 0.1)`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: color
        }}>
          {icon}
        </div>
      </div>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ 
            color: trend > 0 ? 'var(--accent)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: '600'
          }}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {trendLabel || 'vs last month'}
          </span>
        </div>
      )}
    </div>
  );
};

// Helper function to convert hex to rgb for rgba usage
function hexToRgb(color) {
  const map = {
    'var(--primary)': '99, 102, 241',
    'var(--accent)':  '16, 185, 129',
    'var(--warning)': '245, 158, 11',
    'var(--danger)':  '239, 68, 68',
  };
  if (map[color]) return map[color];
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '99, 102, 241';
}

export default StatCard;
