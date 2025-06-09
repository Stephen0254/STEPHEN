import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSpecies() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [species, setSpecies] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await fetch(`/api/species/${id}`);
        if (!res.ok) throw new Error('Failed to fetch species');
        const data = await res.json();
        setSpecies(data);
        setName(data.name);
        setDescription(data.description);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchSpecies();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/species/${id}`, {
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

      navigate('/species');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!species) return <p>Loading species...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Edit Species</h2>
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
        <button type="submit">Update Species</button>
        {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
}

export default EditSpecies;
