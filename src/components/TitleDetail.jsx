import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TitleDetail() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTitle() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/titles/${id}`);
        if (!res.ok) throw new Error('Failed to fetch title');
        const data = await res.json();
        setTitle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTitle();
  }, [id]);

  if (loading) return <p>Loading title...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!title) return <p>Title not found.</p>;

  return (
    <div>
      <h2>{title.name}</h2>
      <p><strong>Description:</strong> {title.description}</p>
    </div>
  );
}

export default TitleDetail;
