import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [existingImage, setExistingImage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/equipment/${id}`);
        if (!res.ok) throw new Error('Failed to fetch equipment data');
        const data = await res.json();
        setFormData({ name: data.name, description: data.description, image: null });
        setExistingImage(data.image);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    if (formData.image) payload.append('image', formData.image);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.token) {
      setMessage('Unauthorized. Please log in as Admin.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update equipment');
      }

      setMessage('Equipment updated successfully!');
      setTimeout(() => navigate('/equipment'), 2000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading equipment...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Edit Equipment</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Change Image (optional):</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          {existingImage && !formData.image && (
            <div style={{ marginTop: '10px' }}>
              <p>Current image:</p>
              <img
                src={`http://localhost:5000/uploads/${existingImage}`}
                alt="Equipment"
                style={{ width: '150px', borderRadius: '8px' }}
              />
            </div>
          )}
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>Update Equipment</button>
      </form>

      {message && (
        <p style={{ marginTop: '15px', color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditEquipment;
