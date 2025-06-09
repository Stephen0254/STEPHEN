import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const CivilizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [civilization, setCivilization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCivilization = async () => {
      try {
        const { data } = await axios.get(`/api/civilizations/${id}`);
        setCivilization(data);
      } catch (err) {
        setError('Failed to fetch civilization');
      } finally {
        setLoading(false);
      }
    };

    fetchCivilization();
  }, [id]);

  const handleEdit = () => {
    navigate(`/civilizations/edit/${id}`);  // fixed route here
  };

  const handleDelete = async () => {
    if (!user?.token) return alert('Login required.');
    if (!window.confirm('Delete this civilization?')) return;

    try {
      await axios.delete(`/api/civilizations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Civilization deleted');
      navigate('/civilizations');
    } catch (err) {
      alert('Failed to delete civilization');
    }
  };

  if (loading) return <p>Loading civilization...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!civilization) return <p>Civilization not found.</p>;

  return (
    <div className="detail-container">
      <h2>{civilization.name}</h2>
      {civilization.image && (
        <img
          src={`/uploads/${civilization.image}`}
          alt={civilization.name}
          style={{ width: '200px', height: 'auto' }}
        />
      )}
      <p><strong>Description:</strong> {civilization.description}</p>

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

export default CivilizationDetail;
