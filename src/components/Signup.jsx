import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage('✅ Sign up successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: '10px',
            color: isSuccess ? 'green' : 'red',
            textAlign: 'center'
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Signup;
