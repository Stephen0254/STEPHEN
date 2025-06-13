import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AutocompleteSearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(trimmed);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSuggestions = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      const allResults = [
        ...(data.characters?.map(item => ({ ...item, type: 'character' })) || []),
        ...(data.species?.map(item => ({ ...item, type: 'species' })) || []),
        ...(data.civilizations?.map(item => ({ ...item, type: 'civilization' })) || []),
        ...(data.weapons?.map(item => ({ ...item, type: 'weapon' })) || []),
        ...(data.equipment?.map(item => ({ ...item, type: 'equipment' })) || []),
        ...(data.titles?.map(item => ({ ...item, type: 'title' })) || []),
      ];

      setSuggestions(allResults);
      setError(allResults.length === 0 ? 'No matches found.' : '');
    } catch (err) {
      console.error('Error fetching suggestions:', err.message);
      setSuggestions([]);
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      navigateToResult(suggestions[0]);
    } else {
      setError('No matching item found.');
    }
  };

  const navigateToResult = (result) => {
    const pathMap = {
      character: `/characters/${result._id}`,
      species: `/species/${result._id}`,
      civilization: `/civilizations/${result._id}`,
      weapon: `/weapons/${result._id}`,
      equipment: `/equipment/${result._id}`,
      title: `/titles/${result._id}`,
    };

    navigate(pathMap[result.type] || '/');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        navigateToResult(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', position: 'relative' }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        padding: '10px 15px'
      }}>
        <input
          type="text"
          placeholder="Search characters, species, weapons..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError('');
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            padding: '10px',
            borderRadius: '24px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#5f6368" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
        </button>
      </div>

      {loading && (
        <p style={{ textAlign: 'center', marginTop: '8px', color: '#555' }}>Searching...</p>
      )}

      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          borderRadius: '8px',
          listStyle: 'none',
          padding: '5px 0',
          margin: '5px 0 0',
          zIndex: 1000,
        }}>
          {suggestions.map((item, index) => (
            <li
              key={item._id}
              onClick={() => navigateToResult(item)}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                background: activeIndex === index ? '#f1f1f1' : '#fff',
                transition: 'background 0.2s',
                fontSize: '16px',
                fontWeight: '500',
                color: '#333',
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {item.name} ({item.type})
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '6px', fontSize: '14px', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default AutocompleteSearchBar;
