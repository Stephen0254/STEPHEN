import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function AddCharacter() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Hero');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
      setMessage('You must be logged in as an admin to add a character.');
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const res = await fetch(`${API_URL}/api/characters`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add character');
      }

      setMessage('✅ Character added successfully!');
      setName('');
      setRole('Hero');
      setDescription('');
      setImage(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setMessage(null);
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Add New Character</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleInputChange(setName)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select
            value={role}
            onChange={handleInputChange(setRole)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="Hero">Hero</option>
            <option value="Villain">Villain</option>
            <option value="Anti-Hero">Anti-Hero</option>
            <option value="Entity">Entity</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleInputChange(setDescription)}
            rows={4}
            placeholder="Enter a brief description of the character"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setMessage(null);
            }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px' }} disabled={loading}>
          {loading ? 'Adding...' : 'Add Character'}
        </button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default AddCharacter;
