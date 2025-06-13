import React, { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';

const PageWrapper = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);

  const wrapperStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '16px',
    backdropFilter: 'blur(6px)',
    backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.9)',
    color: darkMode ? '#f3f4f6' : '#1f2937',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  return <div style={wrapperStyle}>{children}</div>;
};

export default PageWrapper;
