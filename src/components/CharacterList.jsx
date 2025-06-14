import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function CharacterList({ searchTerm = '' }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edited') === 'true') {
      setEditMessage('Character updated successfully.');
      setTimeout(() => setEditMessage(''), 4000);
    }
  }, [location]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/characters`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch characters');
        return res.json();
      })
      .then(data => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this character?');
    if (!confirm) return;

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.token) {
      alert('Unauthorized. Please log in as Admin.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/characters/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete character');
      }

      setCharacters(prev => prev.filter(char => char._id !== id));
      alert('Character deleted successfully.');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Character Profiles</h2>

      {editMessage && (
        <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>
          {editMessage}
        </p>
      )}

      {filteredCharacters.length === 0 && <p>No characters found.</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {filteredCharacters.map(char => (
          <div
            key={char._id}
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
            <Link
              to={`/characters/${char._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {char.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${char.image}`}
                  alt={char.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: '10px' }}>
                <h3>{char.name}</h3>
                <p><strong>Role:</strong> {char.role}</p>
                {char.description && (
                  <p style={{ fontStyle: 'italic' }}>{char.description}</p>
                )}
              </div>
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
              <button
                onClick={() => handleDelete(char._id)}
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
              <Link to={`/characters/edit/${char._id}`}>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
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
    </div>
  );
}

export default CharacterList;
