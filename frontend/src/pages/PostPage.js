// frontend/src/pages/PostPage.js
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostPage = () => {
  const { id } = useParams();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);

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

  // Load post on mount
  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post');
        setLoading(false);
      });
  }, [id]);

  // Handle adding a reply
  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      const { data } = await API.post(`/posts/${id}/reply`, { text: replyText });
      setPost(data);
      setReplyText('');
      setShowReply(false);
    } catch (err) {
      console.error(err);
      alert('Failed to send reply');
    }
  };

  // Handle reaction (like with emoji) - FIXED
  const handleReaction = async (reactionType) => {
    if (!user) return;
    
    try {
      const { data } = await API.post(`/posts/${id}/react`, { reaction: reactionType });
      setPost(data);
      setSelectedReaction(reactionType);
      setShowReactions(false);
    } catch (err) {
      console.error('Reaction error:', err);
      alert('Failed to add reaction. Please try again.');
    }
  };

  // Get reaction emoji based on type
  const getReactionEmoji = (reaction) => {
    switch(reaction) {
      case 'heart': return '❤️';
      case 'like': return '👍';
      case 'laugh': return '😂';
      default: return '❤️';
    }
  };

  // Get total reactions count
  const getTotalReactions = () => {
    if (!post?.reactions) return 0;
    return (post.reactions.heart || 0) + (post.reactions.like || 0) + (post.reactions.laugh || 0);
  };

  // Logout function
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <header>
          <div className="logo-title">
            <img src="/assets/logo.png" alt="logo web" width="80" height="70" />
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
              <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>Logout</span>
            </nav>
            <label className="theme-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>
        </header>
        <section className="home-wrapper">
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        </section>
        <footer>
          <p>Contact: artszy@email.com</p>
          <p>© 2026 My Arts Portfolio</p>
        </footer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header>
          <div className="logo-title">
            <img src="/assets/logo.png" alt="logo web" width="80" height="70" />
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
              <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>Logout</span>
            </nav>
            <label className="theme-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>
        </header>
        <section className="home-wrapper">
          <div style={{ textAlign: 'center', padding: '50px', color: '#ff6b6b' }}>{error}</div>
        </section>
        <footer>
          <p>Contact: artszy@email.com</p>
          <p>© 2026 My Arts Portfolio</p>
        </footer>
      </>
    );
  }

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
            <Link to="/contact">Contact</Link>
            <Link to="/games">Games</Link>
            <Link to="/create-post">Create</Link>
            {isAdmin() && <Link to="/admin">Admin</Link>}
            <Link to="/profile">Profile</Link>
            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
              Logout
            </span>
          </nav>

          <label className="theme-switch">
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      {/* HOME WRAPPER */}
      <section className="home-wrapper">
        <div className="posts-section" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Post Card */}
          <div className="post-card" style={{ marginBottom: '30px' }}>
            {post.image && (
              <img
                src={`http://localhost:5000/${post.image}`}
                alt={post.title}
                style={{ 
                  width: '100%', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  maxHeight: '400px',
                  objectFit: 'cover'
                }}
              />
            )}
            
            <h1 style={{ marginBottom: '10px', color: '#fff' }}>{post.title}</h1>
            
            <small style={{ opacity: 0.8, color: '#fff' }}>
              By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
            </small>
            
            <div style={{ margin: '20px 0', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#fff' }}>
              {post.body}
            </div>
            
            {/* Reactions Section with Hover Emojis - TANGGAL NA ANG SALITANG "Reactions" */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  onMouseEnter={() => user && setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                  style={{ 
                    cursor: user ? 'pointer' : 'default',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '6px 14px',
                    borderRadius: '30px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>
                    {selectedReaction ? getReactionEmoji(selectedReaction) : '❤️'}
                  </span>
                  {/* ✅ TINANGGAL ANG "Reactions" - BILANG NA LANG ANG NAKALAGAY */}
                  <span style={{ fontSize: '14px' }}>
                    {getTotalReactions()}
                  </span>
                </div>

                {/* Floating emoji reactions */}
                {showReactions && user && (
                  <div
                    onMouseEnter={() => setShowReactions(true)}
                    onMouseLeave={() => setShowReactions(false)}
                    style={{
                      position: 'absolute',
                      top: '-60px',
                      left: '0',
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '50px',
                      padding: '8px 15px',
                      display: 'flex',
                      gap: '15px',
                      zIndex: 100,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      animation: 'slideUp 0.2s ease'
                    }}
                  >
                    <span
                      onClick={() => handleReaction('heart')}
                      style={{
                        fontSize: '28px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ❤️
                    </span>
                    <span
                      onClick={() => handleReaction('like')}
                      style={{
                        fontSize: '28px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      👍
                    </span>
                    <span
                      onClick={() => handleReaction('laugh')}
                      style={{
                        fontSize: '28px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      😂
                    </span>
                  </div>
                )}
              </div>

              {/* Show reaction breakdown (optional, pero walang salitang "Reactions") */}
              {post.reactions && getTotalReactions() > 0 && (
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  opacity: 0.7,
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  {post.reactions.heart > 0 && (
                    <span>❤️ {post.reactions.heart}</span>
                  )}
                  {post.reactions.like > 0 && (
                    <span>👍 {post.reactions.like}</span>
                  )}
                  {post.reactions.laugh > 0 && (
                    <span>😂 {post.reactions.laugh}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Replies Section */}
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#fff' }}>Replies</h3>
            
            {user && (
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => setShowReply(!showReply)}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#ff6f6f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    marginBottom: showReply ? '15px' : '0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e85c5c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6f6f'}
                >
                  {showReply ? 'Cancel' : 'Write a Reply'}
                </button>

                {showReply && (
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      placeholder="Write your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
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
                        fontFamily: 'inherit',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      onClick={handleReply}
                      style={{
                        padding: '12px 25px',
                        backgroundColor: '#ff6f6f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e85c5c'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6f6f'}
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            )}

            {post.replies && post.replies.length > 0 ? (
              post.replies.map((r, i) => (
                <div key={i} className="post-card" style={{ marginBottom: '15px', padding: '15px' }}>
                  <strong style={{ fontSize: '14px', color: '#ff6f6f' }}>
                    {r.author?.name || 'Anonymous'}
                  </strong>
                  <p style={{ margin: '10px 0', lineHeight: '1.5', color: '#fff' }}>{r.text}</p>
                  <small style={{ opacity: 0.7, color: '#fff' }}>
                    {new Date(r.createdAt).toLocaleDateString()} at{' '}
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                <p style={{ color: '#fff' }}>No replies yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>

      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default PostPage;