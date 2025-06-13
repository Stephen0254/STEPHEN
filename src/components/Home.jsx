import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000); // Hide intro after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-wrapper">
      {showIntro && (
        <div className="intro-overlay">
          <h1 className="intro-text">Welcome to Dream Comics Universe</h1>
        </div>
      )}

      <div className="home-background">
        <div className="home-overlay">
          <main className="home-container">
            <h1 className="home-title">Dream Comics Universe</h1>
            <p className="home-subtitle">
              Enter a world of heroes, villains, and legends.
            </p>

            {!user && (
              <div className="home-button-container">
                <Link to="/login">
                  <button className="home-button">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="home-button">Sign Up</button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
