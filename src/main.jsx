import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './global.css';

// ✅ Import providers
import { ThemeProvider } from './Context/ThemeContext.jsx';
import { AuthProvider } from './Context/AuthContext.jsx'; // ✅ make sure path and filename match

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    {/* Wrap App with both Theme and Auth Providers */}
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
