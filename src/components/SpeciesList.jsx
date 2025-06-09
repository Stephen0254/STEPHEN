import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SpeciesList() {
  const [species, setSpecies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/species')
      .then(res => res.json())
      .then(data => setSpecies(data))
      .catch(err => console.error('Error fetching species:', err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this species?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/species/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setSpecies(prev => prev.filter(sp => sp._id !== id));
        } else {
          const errorData = await res.json();
          console.error('Delete failed:', errorData.message || res.statusText);
          alert(errorData.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting species:', err);
        alert('An error occurred while deleting species.');
      }
    }
  };

  return (
    <div>
      <h2>Species</h2>

      {species.length === 0 ? (
        <p>No species found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {species.map(sp => (
            <li
              key={sp._id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {sp.image && (
                <img
                  src={`http://localhost:5000/uploads/${sp.image}`}
                  alt={sp.name}
                  style={{ width: '120px', borderRadius: '8px' }}
                />
              )}
              <h3>{sp.name}</h3>
              <p>{sp.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => handleDelete(sp._id)}
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
                <Link to={`/species/edit/${sp._id}`}>
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

export default SpeciesList;
