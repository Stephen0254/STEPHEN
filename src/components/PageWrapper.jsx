import React from 'react';

const PageWrapper = ({ children }) => {
  return (
    <div style={styles.wrapper}>
      {children}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(6px)',
  }
};

export default PageWrapper;
