import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function WeaponList() {
  const [weapons, setWeapons] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/weapons')
      .then(res => res.json())
      .then(data => setWeapons(data))
      .catch(err => console.error('Error fetching weapons:', err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this weapon?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/weapons/${id}`, {
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
    <div>
      <h2>Weapons</h2>
      {weapons.length === 0 ? (
        <p>No weapons found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {weapons.map(weapon => (
            <li
              key={weapon._id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {weapon.image && (
                <img
                  src={`http://localhost:5000/uploads/${weapon.image}`}
                  alt={weapon.name}
                  style={{ width: '120px', borderRadius: '8px' }}
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
