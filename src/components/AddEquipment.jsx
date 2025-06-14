import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const AddEquipment = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setMessage('You must be logged in as an admin to add equipment.');
      return;
    }

    if (!image) {
      setMessage('Please select an image for the equipment.');
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const res = await fetch(`${API_URL}/api/equipment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add equipment');
      }

      setMessage('✅ Equipment added successfully!');
      setName('');
      setDescription('');
      setImage(null);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Add New Equipment</h2>

      {message && (
        <p style={{ color: message.startsWith('✅') ? 'green' : 'red', marginBottom: '10px' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage(null);
            }}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setMessage(null);
            }}
            required
            rows={4}
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

        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Adding...' : 'Add Equipment'}
        </button>
      </form>
    </div>
  );
};

export default AddEquipment;
