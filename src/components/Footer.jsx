// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} DREAM COMICS UNIVERSE. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
