import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const AddCivilization = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(`${API_URL}/api/civilizations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '❌ Failed to add civilization.');
      }

      setMessage('✅ Civilization added successfully!');
      setName('');
      setDescription('');
      setImage(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Add New Civilization</h2>

      {message && (
        <div style={{ marginBottom: '1rem', color: message.startsWith('✅') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage('');
            }}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setMessage('');
            }}
            required
            style={{ width: '100%', padding: '10px', minHeight: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Image:</label>
          <input
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
            width: '100%',
            padding: '12px',
            backgroundColor: '#222',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Adding Civilization...' : 'Add Civilization'}
        </button>
      </form>
    </div>
  );
};

export default AddCivilization;
