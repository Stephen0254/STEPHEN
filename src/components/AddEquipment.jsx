import React, { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function AddEquipment() {
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
      setMessage('❌ You must be logged in as an admin to add equipment.');
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
      const res = await fetch(`${API_URL}/api/equipment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '❌ Failed to add equipment.');
      }

      setMessage('✅ Equipment added successfully!');
      setName('');
      setDescription('');
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Add New Equipment</h2>

      {message && (
        <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '12px' }}>
          <label>Name:</label><br />
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

        <div style={{ marginBottom: '12px' }}>
          <label>Description:</label><br />
          <textarea
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
          <label>Image:</label><br />
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

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            width: '100%',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Adding Equipment...' : 'Add Equipment'}
        </button>
      </form>
    </div>
  );
}

export default AddEquipment;
