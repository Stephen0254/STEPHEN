import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '', // Renamed from 'name'
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Sign up successful!');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" // Renamed from 'name'
          placeholder="Username" // Updated placeholder
          value={formData.username} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <button type="submit" style={{ padding: '10px 20px' }}>Sign Up</button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default Signup;
