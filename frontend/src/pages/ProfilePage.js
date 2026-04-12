// frontend/src/pages/ProfilePage.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ProfilePage = () => {
  const { user, setUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect guest users to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : '/default-avatar.png';

  return (
    <>
      <header>
        <div className="logo-title">
          <img src="/assets/logo.png" alt="logo" width="80" height="70" />
          <h1>Paint Path</h1>
        </div>
        <div className="header-right">
          <nav>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/games">Games</Link>
            <Link to="/create-post">Create</Link>
            
            {/* Admin link - Only admin can see */}
            {isAdmin() && (
              <Link to="/admin">Admin</Link>
            )}
            
            <Link to="/profile" className="active">Profile</Link>
            <span onClick={handleLogout} className="nav-link">Logout</span>
          </nav>
          <label className="theme-switch">
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      {/* Use home-wrapper for the gradient background */}
      <section className="home-wrapper">
        {/* Inner div for centering - does not affect other pages */}
        <div className="profile-center-wrapper">
          <div className="profile-page">
            <h2>My Profile</h2>

            <img
              src={picSrc}
              alt="Profile"
              className="profile-pic-preview"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />

            {msg && <p className="success-msg">{msg}</p>}

            <form onSubmit={handleProfile}>
              <h3>Edit Profile</h3>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Display name"
              />
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Short bio..."
                rows={3}
              />
              <label>Change Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPic(e.target.files[0])}
              />
              <button type="submit">Save Profile</button>
            </form>

            <form onSubmit={handlePassword}>
              <h3>Change Password</h3>
              <input
                type="password"
                placeholder="Current password"
                value={curPw}
                onChange={e => setCurPw(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                required
                minLength={6}
              />
              <button type="submit">Change Password</button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>
    </>
  );
};

export default ProfilePage;