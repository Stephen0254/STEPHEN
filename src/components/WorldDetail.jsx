// src/components/WorldDetail.jsx
import { useParams } from 'react-router-dom';

function WorldDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>World / Realm Detail</h2>
      <p>ID from URL: <strong>{id}</strong></p>
      <p>
        Replace this stub with a real fetch of the world by ID
        once your backend route is ready.
      </p>
    </div>
  );
}

export default WorldDetail;
