import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Core Pages
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Dashboard from './components/DashBoard';

// Character
import CharacterList from './components/CharacterList';
import CharacterDetail from './components/CharacterDetail';
import AddCharacter from './components/AddCharacter';
import EditCharacter from './components/EditCharacter';

// Species
import SpeciesList from './components/SpeciesList';
import AddSpecies from './components/AddSpecies';
import EditSpecies from './components/EditSpecies';
import SpeciesDetail from './components/SpeciesDetail';

// Civilizations
import CivilizationList from './components/CivilizationList';
import AddCivilization from './components/AddCivilization';
import EditCivilization from './components/EditCivilization';
import CivilizationDetail from './components/CivilizationDetail';

// Weapons
import WeaponList from './components/WeaponList';
import AddWeapon from './components/AddWeapon';
import EditWeapon from './components/EditWeapon';
import WeaponDetail from './components/WeaponDetail';

// Equipment
import EquipmentList from './components/EquipmentList';
import AddEquipment from './components/AddEquipment';
import EditEquipment from './components/EditEquipment';
import EquipmentDetail from './components/EquipmentDetail';

// Titles
import TitleDetail from './components/TitleDetail';

// Worlds / Realms
import WorldList from './components/WorldList';
import WorldDetail from './components/WorldDetail';
import AddWorld from './components/AddWorld';
import EditWorld from './components/EditWorld';

// Search
import GlobalSearchBar from './components/GlobalSearchBar';
import SearchPage from './pages/SearchPage';

// Auth
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div className="gradient-background"></div>

        <header style={{ textAlign: 'center', padding: '20px' }}>
          <h1 style={{ margin: 0 }}>DREAM COMICS UNIVERSE</h1>
        </header>

        <GlobalSearchBar />
        <NavBar />

        <main style={{ flex: 1, maxWidth: '800px', margin: 'auto', paddingBottom: '40px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/species" element={<SpeciesList />} />
            <Route path="/species/:id" element={<SpeciesDetail />} />
            <Route path="/civilizations" element={<CivilizationList />} />
            <Route path="/civilizations/:id" element={<CivilizationDetail />} />
            <Route path="/weapons" element={<WeaponList />} />
            <Route path="/weapons/:id" element={<WeaponDetail />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/titles/:id" element={<TitleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout setUser={setUser} />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Worlds / Realms */}
            <Route path="/worlds" element={<WorldList />} />
            <Route path="/worlds/:id" element={<WorldDetail />} />
            <Route path="/worlds/add" element={<PrivateRoute><AddWorld /></PrivateRoute>} />
            <Route path="/worlds/edit/:id" element={<PrivateRoute><EditWorld /></PrivateRoute>} />

            {/* Protected Routes */}
            <Route path="/add-character" element={<PrivateRoute><AddCharacter /></PrivateRoute>} />
            <Route path="/characters/edit/:id" element={<PrivateRoute><EditCharacter /></PrivateRoute>} />

            <Route path="/species/add" element={<PrivateRoute><AddSpecies /></PrivateRoute>} />
            <Route path="/species/edit/:id" element={<PrivateRoute><EditSpecies /></PrivateRoute>} />

            <Route path="/civilizations/add" element={<PrivateRoute><AddCivilization /></PrivateRoute>} />
            <Route path="/civilizations/edit/:id" element={<PrivateRoute><EditCivilization /></PrivateRoute>} />

            <Route path="/weapons/add" element={<PrivateRoute><AddWeapon /></PrivateRoute>} />
            <Route path="/weapons/edit/:id" element={<PrivateRoute><EditWeapon /></PrivateRoute>} />

            <Route path="/equipment/add" element={<PrivateRoute><AddEquipment /></PrivateRoute>} />
            <Route path="/equipment/edit/:id" element={<PrivateRoute><EditEquipment /></PrivateRoute>} />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
