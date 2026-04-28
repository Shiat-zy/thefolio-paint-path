// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user, logout, isAdmin } = useAuth(); // include isAdmin
  const navigate = useNavigate();

  // ✅ Redirect non-admin or guest users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/home');
    }
  }, [user, isAdmin, navigate]);

  // Data states
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState({ users: true, posts: true });
  const [error, setError] = useState(null);

  // UI states
  const [tab, setTab] = useState('users');
  const [darkMode, setDarkMode] = useState(false);

  // Search & filter
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState('all');

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const itemsPerPage = 5;

  // Theme init
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [usersRes, postsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/posts')
        ]);
        setUsers(usersRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      } finally {
        setLoading({ users: false, posts: false });
      }
    };
    fetchData();
  }, []);

  // User actions
  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure? This action is permanent.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Post actions
  const removePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch (err) {
      alert('Failed to remove post');
    }
  };

  const restorePost = async (id) => {
    try {
      const { data } = await API.put(`/admin/posts/${id}/restore`);
      setPosts(posts.map(p => p._id === id ? data.post : p));
    } catch (err) {
      alert('Failed to restore post. Make sure backend endpoint exists.');
    }
  };

  // Filtered & paginated data
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const filteredPosts = posts.filter(p => {
    const matchesSearch =
      p.title?.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(postSearch.toLowerCase());
    const matchesStatus = postStatusFilter === 'all' || p.status === postStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const paginatedPosts = filteredPosts.slice(
    (postPage - 1) * itemsPerPage,
    postPage * itemsPerPage
  );
  const totalPostPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // Stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    removedPosts: posts.filter(p => p.status === 'removed').length,
  };

  const handleLogout = () => {
    if (window.confirm('Log out of admin panel?')) {
      logout();
      navigate('/login');
    }
  };

  if (error) return <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>{error}</div>;
  if (loading.users && loading.posts) return <div className="loader-container"><div className="spinner"></div><div className="loading-text">Loading admin dashboard...</div></div>;

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
            <Link to="/create-post">Create</Link>
            {isAdmin() && (
              <Link to="/admin" className="active">Admin</Link>
            )}
            <Link to="/profile">Profile</Link>
            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
              Logout
            </span>
          </nav>

          <label className="theme-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      {/* ADMIN DASHBOARD CONTAINER */}
      <div className="home-wrapper admin-dashboard">
        <h2>Admin Dashboard</h2>

        {/* Statistics cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>👥 Users</h3>
            <p>{stats.totalUsers} total</p>
            <small>{stats.activeUsers} active</small>
          </div>
          <div className="stat-card">
            <h3>📝 Posts</h3>
            <p>{stats.totalPosts} total</p>
            <small>{stats.publishedPosts} published · {stats.removedPosts} removed</small>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            onClick={() => setTab('users')}
            className={tab === 'users' ? 'active' : ''}
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => setTab('posts')}
            className={tab === 'posts' ? 'active' : ''}
          >
            📝 Manage Posts
          </button>
        </div>

        {/* Users tab */}
        {tab === 'users' && (
          <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge ${u.status}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleStatus(u._id)}
                        className={u.status === 'active' ? 'btn-danger' : 'btn-success'}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="btn-danger"
                        style={{ marginLeft: '8px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalUserPages > 1 && (
              <div className="pagination">
                <button disabled={userPage === 1} onClick={() => setUserPage(p => p - 1)}>Prev</button>
                <span>Page {userPage} of {totalUserPages}</span>
                <button disabled={userPage === totalUserPages} onClick={() => setUserPage(p => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}

        {/* Posts tab */}
        {tab === 'posts' && (
          <>
            <div className="search-bar" style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={postSearch}
                onChange={(e) => {
                  setPostSearch(e.target.value);
                  setPostPage(1);
                }}
              />
              <select
                value={postStatusFilter}
                onChange={(e) => {
                  setPostStatusFilter(e.target.value);
                  setPostPage(1);
                }}
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="removed">Removed</option>
              </select>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map(p => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.author?.name}</td>
                    <td>
                      <span className={`status-badge ${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.status === 'published' && (
                        <button className="btn-danger" onClick={() => removePost(p._id)}>
                          Remove
                        </button>
                      )}
                      {p.status === 'removed' && (
                        <button className="btn-success" onClick={() => restorePost(p._id)}>
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedPosts.length === 0 && (
                  <tr>
                    <td colSpan="4">No posts found</td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalPostPages > 1 && (
              <div className="pagination">
                <button disabled={postPage === 1} onClick={() => setPostPage(p => p - 1)}>Prev</button>
                <span>Page {postPage} of {totalPostPages}</span>
                <button disabled={postPage === totalPostPages} onClick={() => setPostPage(p => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>
    </>
  );
};

export default AdminPage;