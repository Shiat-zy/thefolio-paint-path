// frontend/src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showReactionsForPost, setShowReactionsForPost] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dark mode logic
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

  // ✅ Emoji picker uses existing PUT /posts/:id/like endpoint
  // All emojis (heart, like, laugh) will increment the same like count
  const handleReaction = async (postId) => {
    if (!user) {
      alert('Please login to react');
      return;
    }
    try {
      const { data } = await API.put(`/posts/${postId}/like`);
      setPosts(prevPosts => prevPosts.map(post =>
        post._id === postId ? data : post
      ));
      setShowReactionsForPost(null);
    } catch (err) {
      console.error('Like error:', err);
      alert('Failed to add reaction');
    }
  };

  // Get total likes from the 'likes' array length
  const getTotalLikes = (post) => {
    return post.likes?.length || 0;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <Link to="/home" className="active">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/games">Games</Link>

            {/* CONDITIONAL NAVBAR */}
            {!user ? (
              <Link to="/register">Register</Link>
            ) : (
              <>
                <Link to="/create-post">Create</Link>
                {isAdmin() && <Link to="/admin">Admin</Link>}
                <Link to="/profile">Profile</Link>
                <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
                  Logout
                </span>
              </>
            )}
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
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-text">
            <h2>My<br /> Art Portfolio</h2>
            <p>
              Welcome to my portfolio! This website showcases my passion for arts and creativity.
              I enjoy expressing ideas and emotions through visual art.
            </p>
          </div>
          <div className="hero-image">
            <img
              src="/assets/me.png"
              alt="My avatar"
              width="400"
              height="500"
            />
          </div>
        </section>

        {/* WHY I LOVE ARTS */}
        <section className="why">
          <div className="why-container">
            <div className="why-image">
              <img src="/assets/mee.png" alt="Artwork sample" />
            </div>
            <div className="why-text">
              <h2>Why I Love Arts</h2>
              <ul>
                <li>Art allows me to express my creativity</li>
                <li>It helps me relax and reduce stress</li>
                <li>I enjoy experimenting with colors and designs</li>
                <li>Art lets me communicate ideas visually</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PREVIEW SECTIONS - conditionally hide Register card when logged in */}
        <section className="preview">
          <div>
            <h3>About Me</h3>
            <p>Learn more about my passion for arts.</p>
            <Link to="/about">Read more</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Get in touch with me.</p>
            <Link to="/contact">Contact me</Link>
          </div>
          {!user && (
            <div>
              <h3>Register</h3>
              <p>Stay connected with my updates.</p>
              <Link to="/register">Register here</Link>
            </div>
          )}
          <div>
            <h3>Games</h3>
            <p>Guess the artist</p>
            <Link to="/games">Let's play a game</Link>
          </div>
        </section>

        {/* POSTS SECTION */}
        <div className="posts-section">
          <h2>Latest Posts</h2>
          {loading && <p>Loading posts...</p>}
          {!loading && posts.length === 0 && <p>No posts yet.</p>}
          {!loading && posts.length > 0 && (
            <div className="posts-grid-3cols">
              {posts.map(p => (
                <div key={p._id} className="post-card">
                  {p.image && (
                    <img
                      src={`http://localhost:5000/uploads/${p.image}`}
                      alt={p.title}
                      className="post-image"
                    />
                  )}
                  <h3>
                    <Link to={`/posts/${p._id}`}>{p.title}</Link>
                  </h3>
                  <p className="post-excerpt">{p.body.substring(0, 80)}...</p>
                  <small className="post-meta">
                    By {p.author?.name} · {new Date(p.createdAt).toLocaleDateString()}
                  </small>

                  {/* EMOJI PICKER (restored) – all emojis call the same like endpoint */}
                  <div className="like-section">
                    <div
                      className="like-button-wrapper"
                      onMouseEnter={() => user && setShowReactionsForPost(p._id)}
                      onMouseLeave={() => setShowReactionsForPost(null)}
                    >
                      <button className="like-btn" type="button">
                        👍 Like ({getTotalLikes(p)})
                      </button>

                      {showReactionsForPost === p._id && user && (
                        <div className="emoji-float">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReaction(p._id);
                            }}
                            className="emoji-option"
                            title="Heart"
                          >
                            ❤️
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReaction(p._id);
                            }}
                            className="emoji-option"
                            title="Like"
                          >
                            👍
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReaction(p._id);
                            }}
                            className="emoji-option"
                            title="Laugh"
                          >
                            😂
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="post-reply-link">
                      <Link to={`/posts/${p._id}`}>
                        💬 Replies: {p.replies?.length || 0}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>

      <style>
        {`
          .posts-grid-3cols {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 30px;
          }

          .post-card {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px);
            border-radius: 16px;
            padding: 15px;
            transition: transform 0.2s ease;
            border: 1px solid rgba(255,255,255,0.25);
            display: flex;
            flex-direction: column;
          }

          .post-card:hover {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.28);
          }

          .post-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 10px;
          }

          .post-card h3 {
            margin: 8px 0;
            font-size: 1.1rem;
            line-height: 1.3;
          }

          .post-card h3 a {
            color: #fff;
            text-decoration: none;
          }

          .post-card h3 a:hover {
            text-decoration: underline;
          }

          .post-excerpt {
            color: #fefefe;
            font-size: 0.75rem;
            line-height: 1.4;
            margin: 5px 0;
          }

          .post-meta {
            color: rgba(255,255,255,0.7);
            font-size: 0.65rem;
            display: block;
            margin: 5px 0 10px 0;
          }

          .like-section {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
          }

          .like-button-wrapper {
            position: relative;
            display: inline-block;
          }

          .like-btn {
            background: rgba(0, 0, 0, 0.3);
            border: none;
            padding: 6px 14px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            color: white;
          }

          .like-btn:hover {
            background: rgba(255, 107, 107, 0.6);
          }

          .emoji-float {
            position: absolute;
            bottom: 45px;
            left: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 40px;
            padding: 8px 15px;
            display: flex;
            gap: 15px;
            z-index: 100;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            animation: fadeInUp 0.2s ease;
            white-space: nowrap;
          }

          .emoji-option {
            font-size: 24px;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .emoji-option:hover {
            transform: scale(1.3);
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .post-reply-link a {
            text-decoration: none;
            font-size: 0.7rem;
            background: rgba(0,0,0,0.25);
            padding: 5px 12px;
            border-radius: 30px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: #fff;
            transition: all 0.2s;
          }

          .post-reply-link a:hover {
            background: rgba(255,107,107,0.6);
          }

          body.dark-mode .post-card {
            background: rgba(30,30,45,0.75);
          }

          body.dark-mode .post-card:hover {
            background: rgba(40,40,60,0.85);
          }

          @media (max-width: 900px) {
            .posts-grid-3cols {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 600px) {
            .posts-grid-3cols {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </>
  );
};

export default HomePage;