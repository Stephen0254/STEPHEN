import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SpeciesList() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/species`);
        const data = await res.json();
        setSpecies(data);
      } catch (err) {
        console.error('Error fetching species:', err);
        setError('Failed to load species. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [API_URL]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this species?')) {
      try {
        const res = await fetch(`${API_URL}/api/species/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setSpecies((prev) => prev.filter((sp) => sp._id !== id));
        } else {
          const errorData = await res.json();
          alert(errorData.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting species:', err);
        alert('An error occurred while deleting species.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '1rem', backgroundColor: 'transparent' }}>
      <h2 style={{ textAlign: 'center' }}>Species</h2>

      {loading && <p>Loading species...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && species.length === 0 ? (
        <p>No species found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {species.map((sp) => (
            <div
              key={sp._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(2px)',
                color: '#fff',
                textAlign: 'center',
              }}
            >
              {sp.image && (
                <img
                  src={`${API_URL}/uploads/${sp.image}`}
                  alt={sp.name}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                />
              )}
              <h3>{sp.name}</h3>
              <p>{sp.description}</p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => handleDelete(sp._id)}
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
                <Link to={`/species/edit/${sp._id}`}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpeciesList;
