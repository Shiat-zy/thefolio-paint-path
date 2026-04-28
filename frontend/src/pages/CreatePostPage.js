// frontend/src/pages/CreatePostPage.js
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect guest users to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Dark mode
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header>
        <div className="logo-title">
          <img src="/assets/logo.png" alt="logo web" width="80" height="70" />
          <h1>Paint Path</h1>
        </div>

        <div className="header-right">
          <nav>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            
            {/* ✅ HIDE CONTACT IF ADMIN IS LOGGED IN */}
            {!isAdmin() && <Link to="/contact">Contact</Link>}
            
            <Link to="/games">Games</Link>
            <Link to="/create-post" className="active">Create</Link>
            
            {/* Admin link - Only admin can see */}
            {isAdmin() && (
              <Link to="/admin">Admin</Link>
            )}
            
            <Link to="/profile">Profile</Link>
            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
              Logout
            </span>
          </nav>

          <label className="theme-switch">
            <input
              type="checkbox"
              id="theme-toggle"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      {/* HOME WRAPPER */}
      <section className="home-wrapper">
        <div className="content" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
          <div className="register-flex" style={{ flexDirection: 'column' }}>
            <div className="register-form-container" style={{ width: '100%' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>✨ Create a New Post</h2>
              <p style={{ textAlign: 'center', marginBottom: '30px', opacity: 0.8 }}>
                Share your art and inspiration with the community
              </p>

              {error && (
                <div className="error-msg" style={{ textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <label>Post Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Give your post a catchy title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="Write your post here..."
                    rows={10}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '15px',
                      backdropFilter: 'blur(8px)',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* ✅ IMAGE UPLOAD – now available for ALL logged-in users */}
                <div className="form-group">
                  <label>📷 Cover Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImage(e.target.files[0])}
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      padding: '10px',
                      borderRadius: '12px'
                    }}
                  />
                </div>

                <button type="submit" disabled={loading} className="register-button">
                  {loading ? 'Publishing...' : '📢 Publish Post'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>
    </>
  );
};

export default CreatePostPage;