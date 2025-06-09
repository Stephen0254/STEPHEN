import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const SpeciesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const { data } = await axios.get(`/api/species/${id}`);
        setSpecies(data);
      } catch (err) {
        setError('Failed to fetch species');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [id]);

  const handleEdit = () => {
    navigate(`/species/edit/${id}`); // ✅ Fixed route
  };

  const handleDelete = async () => {
    if (!user?.token) return alert('Login required.');
    if (!window.confirm('Delete this species?')) return;

    try {
      await axios.delete(`/api/species/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Species deleted');
      navigate('/species');
    } catch (err) {
      alert('Failed to delete species');
    }
  };

  if (loading) return <p>Loading species...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!species) return <p>Species not found.</p>;

  return (
    <div className="detail-container">
      <h2>{species.name}</h2>
      {species.image && (
        <img
          src={`/uploads/${species.image}`}
          alt={species.name}
          style={{ width: '200px', height: 'auto' }}
        />
      )}
      <p><strong>Description:</strong> {species.description}</p>

      {user?.isAdmin && (
        <div className="action-buttons">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeciesDetail;
