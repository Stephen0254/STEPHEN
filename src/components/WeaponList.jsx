import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function WeaponList() {
  const [weapons, setWeapons] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/weapons`);
        const data = await res.json();
        setWeapons(data);
      } catch (err) {
        console.error('Error fetching weapons:', err);
      }
    };

    fetchWeapons();
  }, [API_URL]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this weapon?')) {
      try {
        const res = await fetch(`${API_URL}/api/weapons/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setWeapons(prev => prev.filter(w => w._id !== id));
        } else {
          const errorData = await res.json();
          console.error('Failed to delete weapon:', errorData.message || res.statusText);
          alert(errorData.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting weapon:', err);
        alert('An error occurred while deleting weapon.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Weapons</h2>

      {weapons.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No weapons found.</p>
      ) : (
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: 0 }}>
          {weapons.map(weapon => (
            <li
              key={weapon._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                listStyle: 'none',
                backgroundColor: '#f9f9f9',
              }}
            >
              {weapon.image && (
                <img
                  src={`${API_URL}/uploads/${weapon.image}`}
                  alt={weapon.name}
                  style={{ width: '100%', borderRadius: '6px', marginBottom: '10px' }}
                />
              )}
              <h3>{weapon.name}</h3>
              <p>{weapon.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => handleDelete(weapon._id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
                <Link to={`/weapons/edit/${weapon._id}`}>
                  <button
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WeaponList;
