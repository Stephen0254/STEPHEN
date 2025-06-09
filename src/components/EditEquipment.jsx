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

  useEffect(() => {
    fetch(`http://localhost:5000/api/equipment/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({ name: data.name, description: data.description, image: null });
        setExistingImage(data.image);
      })
      .catch((err) => console.error('Failed to fetch equipment:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    if (formData.image) {
      payload.append('image', formData.image);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${id}`, {
        method: 'PUT',
        body: payload,
      });

      if (res.ok) {
        navigate('/equipment');
      } else {
        console.error('Failed to update equipment');
      }
    } catch (err) {
      console.error('Error updating equipment:', err);
    }
  };

  return (
    <div>
      <h2>Edit Equipment</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <br />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <br />
        {existingImage && (
          <div>
            <p>Current Image:</p>
            <img
              src={`http://localhost:5000/uploads/${existingImage}`}
              alt="Equipment"
              style={{ width: '120px', borderRadius: '8px' }}
            />
          </div>
        )}
        <input type="file" name="image" onChange={handleChange} />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditEquipment;
