import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EditCharacter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Hero');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/characters/${id}`);
        if (!response.ok) throw new Error('Failed to fetch character');
        const data = await response.json();

        setName(data.name || '');
        setRole(data.role || 'Hero');
        setDescription(data.description || '');
        setExistingImage(data.image || '');
      } catch (error) {
        console.error(error);
        setMessage('Failed to load character data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user?.token) {
      setMessage('Unauthorized. Please log in as Admin.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/characters/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update character');
      }

      setMessage('Character updated successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading character...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Edit Character</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="Hero">Hero</option>
            <option value="Villain">Villain</option>
            <option value="Anti-Hero">Anti-Hero</option>
            <option value="Entity">Entity</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Change Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {existingImage && !image && (
            <div style={{ marginTop: '10px' }}>
              <p>Current image:</p>
              <img
                src={`${API_BASE}/uploads/${existingImage}`}
                alt={`${name} character preview`}
                style={{ width: '150px', borderRadius: '8px' }}
              />
            </div>
          )}
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>
          Update Character
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: '15px',
            color: message.includes('success') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default EditCharacter;
