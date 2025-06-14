import React, { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function AddCivilization() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setMessage('❌ You must be logged in as an admin to add a civilization.');
      return;
    }

    if (!name.trim() || !description.trim() || !image) {
      setMessage('⚠️ All fields including image are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const res = await fetch(`${API_URL}/api/civilizations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '❌ Failed to add civilization.');
      }

      setMessage('✅ Civilization added successfully!');
      setName('');
      setDescription('');
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Add New Civilization</h2>

      {message && (
        <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="name">Name:</label><br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage('');
            }}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="description">Description:</label><br />
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setMessage('');
            }}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="image">Image:</label><br />
          <input
            id="image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setMessage('');
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Adding Civilization...' : 'Add Civilization'}
        </button>
      </form>
    </div>
  );
}

export default AddCivilization;
