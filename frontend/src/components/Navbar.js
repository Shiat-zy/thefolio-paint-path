import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <h2>TheFolio</h2>

      <Link to="/home">Home</Link>

      {user ? (
        <>
          <Link to="/create-post">Create</Link>
          <Link to="/profile">Profile</Link>

          <span onClick={handleLogout} className="nav-link">
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
