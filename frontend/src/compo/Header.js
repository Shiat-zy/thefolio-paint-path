import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../cont/ThemeContext';

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

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
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
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