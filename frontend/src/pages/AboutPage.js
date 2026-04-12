import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AboutPage = () => {
  const { user, logout, isAdmin } = useAuth(); // kunin ang user
  const navigate = useNavigate();

  // Dark mode state
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
            <Link to="/about" className="active">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/games">Games</Link>

            {/* ✅ CONDITIONAL NAVBAR */}
            {!user ? (
              // GUEST: Register link lang
              <Link to="/register">Register</Link>
            ) : (
              // LOGGED IN (ordinary user + admin)
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

      <main>
        <section className="content about-page">
          {/* TOP TWO CONTAINERS */}
          <div className="about-top">
            <div className="about-box">
              <span className="about-number">01</span>
              <h2>What I Love About Arts</h2>
              <p>
                Art allows me to express my creativity and imagination.
                I love experimenting with colors, textures, and styles
                to make each piece unique.
              </p>
            </div>

            <div className="about-box">
              <span className="about-number">02</span>
              <h2>My Journey with Arts</h2>
              <p>
                I started drawing and painting at a young age.
                Over time, I explored different mediums and styles.
              </p>
            </div>
          </div>

          {/* CENTER IMAGE */}
          <div className="about-center-image">
            <a href="/assets/my_work.jpg">
              <img src="/assets/my_work.jpg" alt="My artwork" />
            </a>
          </div>

          {/* ORDERED LIST */}
          <div className="about-list about-box">
            <span className="about-number">03</span>
            <h2>My Art Journey Steps</h2>
            <ol>
              <li>Learned basic drawing techniques</li>
              <li>Experimented with watercolor and acrylic</li>
              <li>Joined school art competitions</li>
              <li>Created my own portfolio of artworks</li>
            </ol>
          </div>

          {/* BOTTOM IMAGE GALLERY */}
          <div className="about-bottom-image">
            <div className="gallery-item">
              <a href="/assets/sluc.jpg"><img src="/assets/sluc.jpg" alt="SLUC" /></a>
              <p className="caption">SLUC Building</p>
            </div>
            <div className="gallery-item">
              <a href="/assets/ccs.jpg"><img src="/assets/ccs.jpg" alt="CSS New Building" /></a>
              <p className="caption">CSS New Building</p>
            </div>
            <div className="gallery-item">
              <a href="/assets/dog.jpg"><img src="/assets/dog.jpg" alt="Coffee Painting" /></a>
              <p className="caption">Coffee Painting</p>
            </div>
            <div className="gallery-item">
              <a href="/assets/bird.jpg"><img src="/assets/bird.jpg" alt="Watercolor" /></a>
              <p className="caption">Watercolor Art</p>
            </div>
            <div className="gallery-item">
              <a href="/assets/drawing.jpg"><img src="/assets/drawing.jpg" alt="Sketch" /></a>
              <p className="caption">Sketch Artwork</p>
            </div>
          </div>

          {/* BLOCKQUOTE SECTION */}
          <div className="about-list about-box">
            <blockquote cite="http://www.worldwildlife.org/who/index.html">
              “I dream of painting and then I paint my dream.” – Vincent Van Gogh
            </blockquote>
          </div>
        </section>
      </main>

      <footer>
        <p>Contact: artszy@email.com</p>
        <p>© 2026 My Arts Portfolio</p>
      </footer>
    </>
  );
};

export default AboutPage;