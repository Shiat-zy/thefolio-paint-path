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
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  
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

  // Fetch post data
  const fetchPost = useCallback(async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setTitle(res.data.title);
      setBody(res.data.body);
      setCurrentImage(res.data.image); 
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
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      if (newImage) {
        formData.append('image', newImage);
      }

      await API.put(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
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
            
            {/* ✅ HIDE CONTACT IF ADMIN IS LOGGED IN */}
            {!isAdmin() && <Link to="/contact">Contact</Link>}
            
            <Link to="/games">Games</Link>
            <Link to="/create-post">Create</Link>
            {isAdmin() && <Link to="/admin">Admin</Link>}
            <Link to="/profile">Profile</Link>
            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>Logout</span>
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
          padding: '60px 20px'
        }}
      >
        <div className="edit-post-container" style={{ maxWidth: '650px', width: '100%' }}>
          
          <form onSubmit={handleSubmit} className="glass-form">
            
            {/* Top Bar with Back Link */}
            <div className="form-top-bar">
              <Link to={`/posts/${id}`} className="back-link">
                ← Back to Post
              </Link>
            </div>

            {/* Header Content */}
            <div className="form-header">
              <h2>✏️ Edit Post</h2>
              <p>Update your art post details</p>
            </div>

            {error && <div className="api-error-message">{error}</div>}

            {/* Title Input */}
            <div className="input-wrapper">
              <label>Post Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter an engaging title"
                required
              />
            </div>

            {/* Content Input */}
            <div className="input-wrapper">
              <label>Content</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your post content here..."
                rows={8}
                required
              />
            </div>

            {/* Image Upload Input */}
            <div className="input-wrapper">
              <label>Cover Image <span className="optional-tag">(Optional)</span></label>
              
              <div className="image-upload-section">
                {/* Show current image if it exists and a new one hasn't been selected yet */}
                {currentImage && !newImage && (
                  <div className="current-image-preview">
                    <img src={`http://localhost:5000/uploads/${currentImage}`} alt="Current cover" />
                    <div className="image-info">
                      <span className="image-title">Current Cover Image</span>
                      <span className="image-subtitle">Upload a new file to replace this</span>
                    </div>
                  </div>
                )}

                <div className="file-input-container">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={e => setNewImage(e.target.files[0])}
                    className="hidden-file-input"
                  />
                  <label htmlFor="file-upload" className={`custom-file-button ${newImage ? 'has-file' : ''}`}>
                    {newImage ? `✅ Selected: ${newImage.name}` : '📁 Choose New Image'}
                  </label>
                </div>
              </div>
            </div>

            <hr className="form-divider" />

            <div className="form-actions">
              <Link to={`/posts/${id}`} className="cancel-btn">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Updating...' : '📝 Save Changes'}
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>

      <style>{`
        /* Form Container */
        .edit-post-container .glass-form {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        /* Top Bar & Header */
        .form-top-bar {
          margin-bottom: 20px;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: 0.3s;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(0,0,0,0.1);
        }
        
        .back-link:hover {
          color: #fff;
          background: rgba(0,0,0,0.3);
        }

        .form-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .form-header h2 {
          margin: 0 0 5px 0;
          font-size: 28px;
          color: #fff;
        }

        .form-header p {
          margin: 0;
          opacity: 0.7;
          font-size: 15px;
          color: #fff;
        }
        
        /* Input Fields */
        .edit-post-container .input-wrapper {
          margin-bottom: 25px;
        }
        
        .edit-post-container label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,0.9);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .optional-tag {
          font-size: 0.75rem;
          opacity: 0.6;
          text-transform: none;
          font-weight: 400;
          letter-spacing: normal;
        }
        
        .edit-post-container input[type="text"],
        .edit-post-container textarea {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.15);
          color: #fff;
          font-size: 16px;
          box-sizing: border-box;
          transition: all 0.3s ease;
          font-family: inherit;
          resize: vertical;
        }
        
        .edit-post-container input[type="text"]:focus,
        .edit-post-container textarea:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255,107,107,0.2);
          background: rgba(0,0,0,0.25);
        }
        
        .edit-post-container input::placeholder,
        .edit-post-container textarea::placeholder {
          color: rgba(255,255,255,0.5);
        }

        /* Image Upload Area */
        .image-upload-section {
          background: rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .current-image-preview {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .current-image-preview img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.2);
        }

        .image-info {
          display: flex;
          flex-direction: column;
        }

        .image-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .image-subtitle {
          font-size: 12px;
          opacity: 0.6;
          color: #fff;
        }

        .hidden-file-input {
          display: none;
        }
        
        .custom-file-button {
          display: block;
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: 1px dashed rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
          color: #fff;
          text-align: center;
          cursor: pointer;
          transition: 0.3s;
          box-sizing: border-box;
          font-size: 14px;
        }
        
        .custom-file-button:hover {
          background: rgba(255,255,255,0.1);
          border-color: #ff6b6b;
        }

        .custom-file-button.has-file {
          border-style: solid;
          border-color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
          color: #e8f5e9;
        }
        
        /* Actions */
        .form-divider {
          border: 0;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 30px 0;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .cancel-btn {
          flex: 1;
          text-align: center;
          padding: 15px;
          border-radius: 30px;
          color: #fff;
          background: rgba(255,255,255,0.1);
          text-decoration: none;
          font-weight: 600;
          transition: 0.3s;
        }

        .cancel-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .submit-btn {
          flex: 2;
          padding: 15px;
          background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,107,107,0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Error Message */
        .api-error-message {
          background: rgba(255, 70, 70, 0.2);
          border-left: 4px solid #ff6b6b;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 25px;
          color: #ffcccc;
          font-size: 14px;
        }
        
        /* Dark Mode Overrides */
        body.dark-mode .edit-post-container .glass-form {
          background: rgba(30,30,40,0.85);
          border-color: rgba(255,255,255,0.1);
        }
        
        body.dark-mode .edit-post-container input[type="text"],
        body.dark-mode .edit-post-container textarea,
        body.dark-mode .image-upload-section {
          background: rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.05);
        }

        @media (max-width: 600px) {
          .edit-post-container .glass-form {
            padding: 30px 20px;
          }
          .form-actions {
            flex-direction: column;
          }
          .cancel-btn, .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default EditPostPage;