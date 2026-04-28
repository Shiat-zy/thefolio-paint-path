// frontend/src/pages/ContactPage.js
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, isAdmin } = useAuth(); // kunin ang user at isAdmin
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Refs for scrolling to first error
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'cName' ? 'name' : id === 'cEmail' ? 'email' : 'message']: value
    }));
    if (errors[id === 'cName' ? 'name' : id === 'cEmail' ? 'email' : 'message']) {
      setErrors(prev => ({
        ...prev,
        [id === 'cName' ? 'name' : id === 'cEmail' ? 'email' : 'message']: ''
      }));
    }
  };

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const showError = (field, message, ref) => {
    setErrors(prev => ({ ...prev, [field]: message }));
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ref.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let firstRef = null;

    if (!formData.name.trim()) {
      showError('name', 'Please fill out this field.', nameRef);
      firstRef = nameRef;
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      showError('name', 'Name must be at least 3 characters.', nameRef);
      firstRef = nameRef;
      isValid = false;
    } else {
      clearError('name');
    }

    if (!formData.email.trim()) {
      showError('email', 'Please fill out this field.', emailRef);
      if (!firstRef) firstRef = emailRef;
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      showError('email', 'Enter a valid email address.', emailRef);
      if (!firstRef) firstRef = emailRef;
      isValid = false;
    } else {
      clearError('email');
    }

    if (!formData.message.trim()) {
      showError('message', 'Please fill out this field.', messageRef);
      if (!firstRef) firstRef = messageRef;
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      showError('message', 'Message must be at least 10 characters.', messageRef);
      if (!firstRef) firstRef = messageRef;
      isValid = false;
    } else {
      clearError('message');
    }

    if (!isValid) return;

    setShowModal(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* HEADER - CONDITIONAL NAVBAR */}
      <header>
        <div className="logo-title">
          <img src="/assets/logo.png" alt="logo web" width="80" height="70" />
          <h1>Paint Path</h1>
        </div>

        <div className="header-right">
          <nav>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            
            {/* ONLY SHOW CONTACT IN NAV IF NOT ADMIN */}
            {!isAdmin() && <Link to="/contact" className="active">Contact</Link>}
            
            <Link to="/games">Games</Link>

            {/* CONDITIONAL NAVBAR */}
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
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

      {/* CONTACT PAGE WRAPPER */}
      <section className="home-wrapper contact-page">
        <section className="contact-container">
          <div className="contact-left">
            <h2>Contact Me</h2>
            <p>If you have questions or want to connect, feel free to send a message.</p>

            <form id="contactForm" onSubmit={handleSubmit} noValidate>
              <div className={`form-group tooltip ${errors.name ? 'show' : ''}`}>
                <label>Name</label>
                <input
                  type="text"
                  id="cName"
                  ref={nameRef}
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <span className="tooltiptext">{errors.name && `⚠ ${errors.name}`}</span>
              </div>

              <div className={`form-group tooltip ${errors.email ? 'show' : ''}`}>
                <label>Email</label>
                <input
                  type="email"
                  id="cEmail"
                  ref={emailRef}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="tooltiptext">{errors.email && `⚠ ${errors.email}`}</span>
              </div>

              <div className={`form-group tooltip ${errors.message ? 'show' : ''}`}>
                <label>Message</label>
                <textarea
                  id="cMessage"
                  ref={messageRef}
                  rows="5"
                  placeholder="Write your message here"
                  value={formData.message}
                  onChange={handleChange}
                />
                <span className="tooltiptext">{errors.message && `⚠ ${errors.message}`}</span>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>

          <div className="contact-right">
            <div className="info-item">
              <h4>Phone</h4>
              <p>(123) 456 7890</p>
            </div>
            <div className="info-item">
              <h4>Email</h4>
              <p>artszy@gmail.com</p>
            </div>
            <div className="info-item">
              <h4>Social</h4>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">f</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">⌾</a>
              </div>
            </div>
          </div>
        </section>

        <section className="content small-content">
          <h2>Helpful Resources</h2>
          <table>
            <thead>
              <tr><th>Resource Name</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>Pinterest</td><td>Great for art ideas, references, and color inspiration.</td></tr>
              <tr><td>DeviantArt</td><td>View and share artworks from different artists.</td></tr>
              <tr><td>Adobe Color</td><td>Tool for creating color palettes.</td></tr>
            </tbody>
          </table>
        </section>

        <section className="content small-content">
          <h2>Location</h2>
          <iframe
            src="https://maps.google.com/maps?q=Manila&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="280"
            title="Map location"
          ></iframe>
        </section>

        <section className="content small-content">
          <h2>External Links</h2>
          <ul>
            <li><a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
            <li><a href="https://www.deviantart.com/" target="_blank" rel="noopener noreferrer">DeviantArt</a></li>
            <li><a href="https://www.canva.com" target="_blank" rel="noopener noreferrer">Canva</a></li>
          </ul>
        </section>
      </section>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <h2>✅ Message Sent!</h2>
            <p>Thank you for reaching out. We'll get back to you soon.</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>
    </>
  );
};

export default ContactPage;