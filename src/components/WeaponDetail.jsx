import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const WeaponDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const { data } = await axios.get(`/api/weapons/${id}`);
        setWeapon(data);
      } catch (err) {
        setError('Failed to fetch weapon');
      } finally {
        setLoading(false);
      }
    };

    fetchWeapon();
  }, [id]);

  const handleEdit = () => {
    navigate(`/weapons/edit/${id}`);  // <-- Fixed route here
  };

  const handleDelete = async () => {
    if (!user?.token) return alert('Login required.');
    if (!window.confirm('Delete this weapon?')) return;

    try {
      await axios.delete(`/api/weapons/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Weapon deleted');
      navigate('/weapons');
    } catch (err) {
      alert('Failed to delete weapon');
    }
  };

  if (loading) return <p>Loading weapon...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!weapon) return <p>Weapon not found.</p>;

  return (
    <div className="detail-container">
      <h2>{weapon.name}</h2>
      {weapon.image && (
        <img
          src={`/uploads/${weapon.image}`}
          alt={weapon.name}
          style={{ width: '200px', height: 'auto' }}
        />
      )}
      <p><strong>Description:</strong> {weapon.description}</p>

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

export default WeaponDetail;  