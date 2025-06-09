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
    fetch('/api/characters')
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
      const res = await fetch(`/api/characters/${id}`, {
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

  const cardStyle = {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>Character Profiles</h2>
      {editMessage && (
        <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>
          {editMessage}
        </p>
      )}
      {filteredCharacters.length === 0 && <p>No characters found.</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredCharacters.map(char => (
          <li key={char._id}>
            <Link to={`/character/${char._id}`} style={cardStyle}>
              {char.image && (
                <img
                  src={`http://localhost:5000${char.image}`} // ✅ Fixed image path
                  alt={char.name}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              )}
              <h3>{char.name}</h3>
              <p><strong>Role:</strong> {char.role}</p>
              {char.description && (
                <p style={{ fontStyle: 'italic' }}>{char.description}</p>
              )}
            </Link>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <button
                onClick={() => handleDelete(char._id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterList;
