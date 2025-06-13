import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('user'));
      } catch {
        setError('Invalid user data. Please log in again.');
        return;
      }

      const token = user?.token;
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [API_URL]);

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '40px auto',
        padding: '20px',
        borderRadius: '12px',
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        color: '#222',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111' }}>User Profile</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {profile ? (
        <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>User ID:</strong> {profile._id}</p>
          {'isAdmin' in profile && (
            <p><strong>Role:</strong> {profile.isAdmin ? 'Admin' : 'User'}</p>
          )}
        </div>
      ) : (
        !error && <p style={{ textAlign: 'center' }}>Loading profile...</p>
      )}
    </div>
  );
}

export default UserProfile;
