import React, { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const AddWeapon = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return setMessage('Name is required.');
    if (!image) return setMessage('Image is required.');

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
      return setMessage('You must be logged in as an admin to add weapons.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    try {
      setLoading(true);
      setMessage('');

      const res = await fetch(`${API_URL}/api/weapons`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add weapon');
      }

      setMessage('✅ Weapon added successfully!');
      setName('');
      setDescription('');
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>Add New Weapon</h2>

      {message && (
        <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>
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
              setMessage('');
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
              setMessage('');
            }}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Image:</label>
          <input
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

        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Adding...' : 'Add Weapon'}
        </button>
      </form>
    </div>
  );
};

export default AddWeapon;
