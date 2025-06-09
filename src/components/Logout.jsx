import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('user'); // clear user from localStorage
    setUser(null);                   // update App user state
    navigate('/');                   // redirect to home
  }, [navigate, setUser]);

  return null;
};

export default Logout;
