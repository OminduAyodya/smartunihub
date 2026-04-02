import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiCompass, FiBell, FiLogOut, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import '../styles/Components.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🎉 EventHub
        </h1>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/calendar"><FiCompass /> Calendar</a></li>
          <li><a href="/dashboard"><FiCompass /> Events</a></li>

          <li><a href="/stall-allocations">🎪 My Stalls</a></li>
          <li className="add-event-nav"><a href="/create-event"><FiPlus /> Add Event</a></li>
          <li><a href="/notifications"><FiBell /> Notifications</a></li>
          {user?.role === 'admin' && (
            <li><a href="/admin">Admin Panel</a></li>
          )}
          {user ? (
            <>
              <li className="user-info">👤 {user.name}</li>
              <li><button className="logout-btn" onClick={handleLogout}><FiLogOut /> Logout</button></li>
            </>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/register" className="register-link"><FiUserPlus /> Sign Up</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
