import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setAuthorized(true);
    }

    setChecking(false);
  }, []);

  if (checking) return <div>Checking access...</div>;

  return authorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
