// frontend/src/pages/EditPostPage.js
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode init
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

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch post data - defined with useCallback to be used in useEffect
  const fetchPost = useCallback(async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setTitle(res.data.title);
      setBody(res.data.body);
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.put(`/posts/${id}`, { title, body });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
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
            {isAdmin() && <Link to="/admin">Admin</Link>}
            <Link to="/profile">Profile</Link>
            <span onClick={handleLogout} className="nav-link">Logout</span>
          </nav>
          <label className="theme-switch">
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      {/* MAIN CONTENT - CENTERED */}
      <section
        className="home-wrapper"
        style={{
          minHeight: 'calc(100vh - 150px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px'
        }}
      >
        <div className="edit-post-container" style={{ maxWidth: '700px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>✏️ Edit Post</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', opacity: 0.8 }}>
            Update your art post
          </p>

          {error && <div className="api-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="glass-form">
            <div className="input-wrapper">
              <label>Post Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Post title"
                required
              />
            </div>

            <div className="input-wrapper">
              <label>Content</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your post content here..."
                rows={10}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : '📝 Update Post'}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>

      <style>{`
        .edit-post-container .glass-form {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          padding: 35px 30px;
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        .edit-post-container .input-wrapper {
          margin-bottom: 20px;
        }
        .edit-post-container label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }
        .edit-post-container input,
        .edit-post-container textarea {
          width: 100%;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 16px;
          backdrop-filter: blur(4px);
          box-sizing: border-box;
          transition: 0.3s;
          font-family: inherit;
        }
        .edit-post-container input:focus,
        .edit-post-container textarea:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 12px rgba(255,107,107,0.4);
          background: rgba(255,255,255,0.2);
        }
        .edit-post-container input::placeholder,
        .edit-post-container textarea::placeholder {
          color: rgba(255,255,255,0.6);
        }
        .edit-post-container button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          margin-top: 10px;
        }
        .edit-post-container button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,107,107,0.4);
        }
        .edit-post-container button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .api-error-message {
          background: rgba(255, 70, 70, 0.2);
          border-left: 4px solid #ff6b6b;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          color: #ffcccc;
          text-align: center;
          backdrop-filter: blur(4px);
        }
        body.dark-mode .edit-post-container .glass-form {
          background: rgba(30,30,40,0.7);
          border-color: rgba(255,255,255,0.15);
        }
        body.dark-mode .edit-post-container input,
        body.dark-mode .edit-post-container textarea {
          background: rgba(0,0,0,0.3);
          color: #eee;
        }
        @media (max-width: 600px) {
          .edit-post-container .glass-form {
            padding: 25px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default EditPostPage;