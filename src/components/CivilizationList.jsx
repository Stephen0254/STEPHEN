import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CivilizationList() {
  const [civilizations, setCivilizations] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/civilizations`)
      .then(res => res.json())
      .then(data => setCivilizations(data))
      .catch(err => console.error('Error fetching civilizations:', err));
  }, []);

  const handleDelete = async (id) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    const confirm = window.confirm('Are you sure you want to delete this civilization?');
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/civilizations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setCivilizations(prev => prev.filter(civ => civ._id !== id));
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting civilization:', err);
      alert('An error occurred while deleting civilization.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Civilizations</h2>

      {civilizations.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No civilizations found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {civilizations.map(civ => (
            <div
              key={civ._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
              }}
            >
              {civ.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${civ.image}`}
                  alt={civ.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: '10px' }}>
                <h3>{civ.name}</h3>
                <p>{civ.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                <button
                  onClick={() => handleDelete(civ._id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
                <Link to={`/civilizations/edit/${civ._id}`}>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CivilizationList;
