import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth(); // Added isAdmin here
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <h2>TheFolio</h2>

      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      
      {/* ✅ HIDE CONTACT IF ADMIN IS LOGGED IN */}
      {!isAdmin() && <Link to="/contact">Contact</Link>}
      
      <Link to="/games">Games</Link>

      {user ? (
        <>
          <Link to="/create-post">Create</Link>
          {isAdmin() && <Link to="/admin">Admin</Link>}
          <Link to="/profile">Profile</Link>

          <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
            Logout
          </span>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;