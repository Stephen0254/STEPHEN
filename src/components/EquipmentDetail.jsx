import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/equipment/${id}`);
        setEquipment(data);
      } catch (err) {
        setError('Failed to fetch equipment');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  const handleEdit = () => {
    navigate(`/equipment/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!user?.token) return alert('Login required.');
    if (!window.confirm('Delete this equipment?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Equipment deleted');
      navigate('/equipment');
    } catch (err) {
      alert('Failed to delete equipment');
    }
  };

  if (loading) return <p>Loading equipment...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!equipment) return <p>Equipment not found.</p>;

  return (
    <div className="detail-container">
      <h2>{equipment.name}</h2>
      {equipment.image && (
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${equipment.image}`}
          alt={equipment.name}
          style={{ width: '200px', height: 'auto' }}
        />
      )}
      <p><strong>Description:</strong> {equipment.description}</p>

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

export default EquipmentDetail;
