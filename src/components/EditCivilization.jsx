import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditCivilization() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [civilization, setCivilization] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCivilization = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/civilizations/${id}`);
        if (!res.ok) throw new Error('Failed to fetch civilization');
        const data = await res.json();
        setCivilization(data);
        setName(data.name);
        setDescription(data.description);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchCivilization();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/civilizations/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Update failed');
      }

      navigate('/civilizations');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!civilization) return <p>Loading civilization...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Edit Civilization</h2>
      <form onSubmit={handleUpdate} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setMessage('');
            }}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              setMessage('');
            }}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>New Image (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              setImage(e.target.files[0]);
              setMessage('');
            }}
            style={{ marginBottom: '10px' }}
          />
        </div>
        <button type="submit">Update Civilization</button>
        {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
}

export default EditCivilization;
