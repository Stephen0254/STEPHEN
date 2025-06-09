// components/AdminQuickAdd.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const buttonStyle = {
  padding: '8px 12px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '6px',
  backgroundColor: '#eee',
  border: '1px solid #ccc',
};

const quickAddStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '20px',
};

function AdminQuickAdd({ user }) {
  if (!user?.isAdmin) return null;

  return (
    <div style={quickAddStyle}>
      <Link to="/species/add"><button style={buttonStyle}>Add Species</button></Link>
      <Link to="/civilizations/add"><button style={buttonStyle}>Add Civilization</button></Link>
      <Link to="/weapons/add"><button style={buttonStyle}>Add Weapon</button></Link>
      <Link to="/equipment/add"><button style={buttonStyle}>Add Equipment</button></Link>
    </div>
  );
}

export default AdminQuickAdd;
