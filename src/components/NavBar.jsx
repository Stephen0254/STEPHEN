import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Context/ThemeContext';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          padding: 16px 32px;
          backdrop-filter: blur(6px);
          background-color: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(102, 204, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar.light {
          background-color: rgba(255, 255, 255, 0.8);
          color: #1f2937;
        }

        .navbar.dark {
          background-color: rgba(17, 24, 39, 0.9);
          color: #f3f4f6;
        }

        .nav-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .nav-link {
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          background-color: rgba(255, 255, 255, 0.08);
          color: inherit;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background-color: rgba(102, 204, 255, 0.2);
          transform: scale(1.05);
        }

        .theme-button {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          background-color: #3b82f6;
          color: #ffffff;
          font-weight: 600;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .theme-button:hover {
          background-color: #2563eb;
          transform: scale(1.05);
        }
      `}</style>

      <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
        {/* Left: Main Navigation */}
        <div className="nav-links">
          {['/', '/characters', '/species', '/civilizations', '/weapons', '/equipment'].map((path, idx) => {
            const labels = ['Home', 'Characters', 'Species', 'Civilizations', 'Weapons', 'Equipment'];
            return (
              <Link key={path} to={path} className="nav-link">
                {labels[idx]}
              </Link>
            );
          })}
        </div>

        {/* Middle: Admin Add Links */}
        {user && (
          <div className="nav-links">
            {[
              { path: '/add-character', label: 'Add Character' },
              { path: '/species/add', label: 'Add Species' },
              { path: '/civilizations/add', label: 'Add Civilization' },
              { path: '/weapons/add', label: 'Add Weapon' },
              { path: '/equipment/add', label: 'Add Equipment' },
            ].map(({ path, label }) => (
              <Link key={path} to={path} className="nav-link">
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right: Theme Toggle + Auth */}
        <div className="nav-links">
          <button className="theme-button" onClick={toggleTheme}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>

          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Signup</Link>
            </>
          ) : (
            <Link to="/logout" className="nav-link">Logout</Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
