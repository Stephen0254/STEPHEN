import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditWorld = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/worlds/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
      });
  }, [API_URL, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const res = await fetch(`${API_URL}/api/worlds/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) navigate('/worlds');
    else alert('Update failed');
  };

  return (
    <form onSubmit={handleUpdate} style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Edit World</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditWorld;
