import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../cont/ThemeContext';
import { useAuth } from '../context/AuthContext'; // ✅ Imported useAuth

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { isAdmin } = useAuth(); // ✅ Extract isAdmin

  return (
    <header>
      <div className="logo-title">
        <img src="/assets/logo.png" alt="logo" width="80" height="70" />
        <h1>Paint Path</h1>
      </div>
      <div className="header-right">
        <nav>
          <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
          
          {/* ✅ HIDE CONTACT IF ADMIN IS LOGGED IN */}
          {!isAdmin() && (
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
          )}
          
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink>
          <NavLink to="/games" className={({ isActive }) => isActive ? 'active' : ''}>Games</NavLink>
        </nav>
        <label className="theme-switch">
          <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
    </header>
  );
};

export default Header;