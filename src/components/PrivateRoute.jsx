import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
