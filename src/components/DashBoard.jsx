import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const futuristicColors = {
  primary: '#00FFF7',
  secondary: '#FF00F7',
  backgroundBlur: 'rgba(0, 0, 0, 0.2)',
  neonGlow: '0 0 12px #00FFF7, 0 0 24px #00FFF7',
};

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login'); // redirect if not logged in
    }
  }, [navigate]);

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: futuristicColors.backgroundBlur,
        backdropFilter: 'blur(8px)',
        boxShadow: futuristicColors.neonGlow,
        color: futuristicColors.primary,
        fontFamily: "'Orbitron', sans-serif",
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <h2 style={{ fontSize: '2.5rem', marginBottom: '12px', textShadow: futuristicColors.neonGlow }}>
        Admin Dashboard
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '24px' }}>
        Welcome. Here you can manage characters and universe data.
      </p>

      <button
        onClick={() => navigate('/characters')}
        style={{
          padding: '12px 32px',
          fontSize: '1.2rem',
          fontWeight: '700',
          color: futuristicColors.primary,
          backgroundColor: 'transparent',
          border: `2px solid ${futuristicColors.primary}`,
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: futuristicColors.neonGlow,
          transition: 'all 0.3s ease',
          fontFamily: "'Orbitron', sans-serif",
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = futuristicColors.primary;
          e.target.style.color = '#000';
          e.target.style.boxShadow = `0 0 15px ${futuristicColors.secondary}, 0 0 30px ${futuristicColors.secondary}`;
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = futuristicColors.primary;
          e.target.style.boxShadow = futuristicColors.neonGlow;
          e.target.style.transform = 'scale(1)';
        }}
      >
        Manage Characters
      </button>
    </div>
  );
};

export default Dashboard;
