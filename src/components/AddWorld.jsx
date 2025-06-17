import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddWorld = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      return setError('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/worlds`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to create world');
      }

      const data = await res.json();
      navigate(`/worlds/${data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New World / Realm</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Image (optional):
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <button type="submit">Create World</button>
      </form>

      <style>{`
        .form-container {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        label {
          display: block;
          margin-bottom: 12px;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        button {
          margin-top: 10px;
          padding: 10px 16px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default AddWorld;
