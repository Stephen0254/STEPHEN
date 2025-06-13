import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditWeapon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/weapons/${id}`);
        setFormData({
          name: res.data.name,
          description: res.data.description || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load weapon:', err);
        setError('Failed to load weapon');
        setLoading(false);
      }
    };

    fetchWeapon();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    if (image) {
      form.append('image', image);
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/weapons/${id}`, form, config);
      navigate('/weapons');
    } catch (err) {
      console.error('Failed to update weapon:', err);
      setError('Failed to update weapon');
    }
  };

  if (loading) return <p>Loading weapon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Edit Weapon</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Image:</label><br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Update Weapon</button>
      </form>
    </div>
  );
}

export default EditWeapon;
