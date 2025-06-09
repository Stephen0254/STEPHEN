import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/equipment')
      .then(res => res.json())
      .then(data => setEquipment(data))
      .catch(err => console.error('Error fetching equipment:', err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as admin to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/equipment/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setEquipment(prev => prev.filter(e => e._id !== id));
        } else {
          const errorData = await res.json();
          console.error('Delete failed:', errorData.message || res.statusText);
          alert(errorData.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting equipment:', err);
        alert('An error occurred while deleting equipment.');
      }
    }
  };

  return (
    <div>
      <h2>Equipment</h2>
      {equipment.length === 0 ? (
        <p>No equipment found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {equipment.map(equip => (
            <li
              key={equip._id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {equip.image && (
                <img
                  src={`http://localhost:5000/uploads/${equip.image}`}
                  alt={equip.name}
                  style={{ width: '120px', borderRadius: '8px' }}
                />
              )}
              <h3>{equip.name}</h3>
              <p>{equip.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => handleDelete(equip._id)}
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
                <Link to={`/equipment/edit/${equip._id}`}>
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

export default EquipmentList;
