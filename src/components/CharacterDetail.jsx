import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [character, setCharacter] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const { data } = await axios.get(`/api/characters/${id}`);
        setCharacter(data);
      } catch (err) {
        console.error("Error fetching character:", err);
        setError("Failed to load character.");
      }
    };
    fetchCharacter();
  }, [id]);

  const handleDelete = async () => {
    if (!user?.token) return alert("Login required.");
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`/api/characters/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Character deleted.");
      navigate("/characters");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete character.");
    }
  };

  const handleEdit = () => {
    navigate(`/characters/edit/${id}`);
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!character) return <p>Loading character...</p>;

  return (
    <div className="detail-container">
      <h2>{character.name}</h2>
      {character.image && (
        <img
          src={`/uploads/${character.image}`}
          alt={character.name}
          style={{ width: "200px", height: "auto", borderRadius: "6px", marginBottom: "1rem" }}
        />
      )}
      <p><strong>Role:</strong> {character.role}</p>
      <p>{character.description}</p>

      {user?.isAdmin && (
        <div className="action-buttons" style={{ marginTop: "1rem" }}>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: "1rem" }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterDetail;
