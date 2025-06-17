import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WorldList = () => {
  const [worlds, setWorlds] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/worlds`)
      .then((res) => res.json())
      .then(setWorlds)
      .catch((err) => console.error('Error loading worlds:', err));
  }, [API_URL]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token || !window.confirm('Delete this world?')) return;

    const res = await fetch(`${API_URL}/api/worlds/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setWorlds((prev) => prev.filter((w) => w._id !== id));
    } else {
      const errData = await res.json();
      alert(errData.message || 'Failed to delete.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Worlds / Realms</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {worlds.map((world) => (
          <div key={world._id} style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
            {world.image && (
              <img
                src={`${API_URL}/uploads/${world.image}`}
                alt={world.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }}
              />
            )}
            <h3>{world.name}</h3>
            <p>{world.description}</p>
            <Link to={`/worlds/${world._id}`}>View</Link>{' '}
            <Link to={`/worlds/edit/${world._id}`}>Edit</Link>{' '}
            <button onClick={() => handleDelete(world._id)} style={{ color: 'red' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldList;
