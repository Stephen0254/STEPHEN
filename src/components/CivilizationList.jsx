import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CivilizationList() {
  const [civilizations, setCivilizations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/civilizations')
      .then(res => res.json())
      .then(data => setCivilizations(data))
      .catch(err => console.error('Error fetching civilizations:', err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this civilization?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/civilizations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setCivilizations(prev => prev.filter(civ => civ._id !== id));
        } else {
          const errorData = await res.json();
          console.error('Failed to delete civilization:', errorData.message || res.statusText);
          alert(errorData.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting civilization:', err);
        alert('An error occurred while deleting civilization.');
      }
    }
  };

  return (
    <div>
      <h2>Civilizations</h2>
      {civilizations.length === 0 ? (
        <p>No civilizations found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {civilizations.map(civ => (
            <li
              key={civ._id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {civ.image && (
                <img
                  src={`http://localhost:5000/uploads/${civ.image}`}
                  alt={civ.name}
                  style={{ width: '120px', borderRadius: '8px' }}
                />
              )}
              <h3>{civ.name}</h3>
              <p>{civ.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => handleDelete(civ._id)}
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
                <Link to={`/civilizations/edit/${civ._id}`}>
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

export default CivilizationList;
