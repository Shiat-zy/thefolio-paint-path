// frontend/src/pages/GamesPage.js
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GamesPage = () => {
  const { user, logout, isAdmin } = useAuth(); // kunin ang user at isAdmin
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [resultMsg, setResultMsg] = useState('');
  const [dropText, setDropText] = useState('Drop answer here');
  const [gameFinished, setGameFinished] = useState(false);

  // Audio refs
  const correctAudio = useRef(null);
  const wrongAudio = useRef(null);
  const finishAudio = useRef(null);

  // Game levels data
  const levels = [
    {
      artist: 'davinci',
      images: [
        '/assets/art1.jpg',
        '/assets/art2.jpg',
        '/assets/art3.jpg',
        '/assets/art4.jpg'
      ]
    },
    {
      artist: 'vangogh',
      images: [
        '/assets/art5.jpg',
        '/assets/art6.jpg',
        '/assets/art7.jpg',
        '/assets/art8.jpg'
      ]
    },
    {
      artist: 'picasso',
      images: [
        '/assets/art9.jpg',
        '/assets/art10.jpg',
        '/assets/art11.jpg',
        '/assets/art12.jpg'
      ]
    },
    {
      artist: 'michelangelo',
      images: [
        '/assets/art13.jpg',
        '/assets/art14.jpg',
        '/assets/art15.jpg',
        '/assets/art16.jpg'
      ]
    }
  ];

  // Dark mode
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

  // Load level images and reset UI
  const loadLevel = () => {
    setDropText('Drop answer here');
    setResultMsg('');
    setGameFinished(false);
  };

  useEffect(() => {
    loadLevel();
  }, [currentLevel]);

  // Drag start handler
  const handleDragStart = (e, artistId) => {
    e.dataTransfer.setData('text/plain', artistId);
  };

  // Allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Drop handler
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedArtist = e.dataTransfer.getData('text/plain');
    const correctArtist = levels[currentLevel].artist;

    if (gameFinished) return;

    if (droppedArtist === correctArtist) {
      correctAudio.current?.play();
      setResultMsg('🎉 Correct!');
      setDropText(droppedArtist);

      setTimeout(() => {
        if (currentLevel + 1 < levels.length) {
          setCurrentLevel(prev => prev + 1);
        } else {
          finishAudio.current?.play();
          setResultMsg('🏆 You completed all artists!');
          setDropText('Game Complete 🎨');
          setGameFinished(true);
        }
      }, 1000);
    } else {
      wrongAudio.current?.play();
      setResultMsg('❌ Try again!');
      setDropText('Drop answer here');
    }
  };

  const restartGame = () => {
    setCurrentLevel(0);
    setResultMsg('');
    setDropText('Drop answer here');
    setGameFinished(false);
  };

  const getArtistDisplayName = (artistId) => {
    const map = {
      davinci: 'Leonardo da Vinci',
      vangogh: 'Vincent van Gogh',
      picasso: 'Pablo Picasso',
      michelangelo: 'Michelangelo',
      rembrandt: 'Rembrandt',
      monet: 'Claude Monet'
    };
    return map[artistId] || artistId;
  };

  const currentImages = levels[currentLevel]?.images || [];
  const progressText = gameFinished
    ? 'Finished!'
    : `Artist ${currentLevel + 1} of ${levels.length}`;

  return (
    <>
      {/* Audio elements */}
      <audio ref={correctAudio} src="/assets/audio1.mp3" />
      <audio ref={wrongAudio} src="/assets/audio2.mp3" />
      <audio ref={finishAudio} src="/assets/audio3.mp3" />

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
            {!isAdmin() && <Link to="/contact">Contact</Link>}
            
            <Link to="/games" className="active">Games</Link>

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
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <section className="home-wrapper">
        <div className="content" style={{ justifyContent: 'center' }}>
          <div className="game-section">
            <h2>4 Paint 1 Artist 🎨</h2>
            <p>All pictures are related to <strong>ART</strong>. Guess the Artist!</p>

            <p id="progress" style={{ marginTop: '18px', fontWeight: 700 }}>
              {progressText}
            </p>

            <div className="image-grid">
              {currentImages.map((src, idx) => (
                <img key={idx} src={src} alt={`art ${idx + 1}`} />
              ))}
            </div>

            <p className="drag-text">Drag the correct artist name 🎨</p>

            <div className="choices">
              {['davinci', 'vangogh', 'picasso', 'michelangelo', 'rembrandt', 'monet'].map(artist => (
                <div
                  key={artist}
                  className="choice"
                  draggable={!gameFinished}
                  onDragStart={(e) => handleDragStart(e, artist)}
                  style={{ cursor: gameFinished ? 'default' : 'grab' }}
                >
                  {getArtistDisplayName(artist)}
                </div>
              ))}
            </div>

            <div
              className="drop-box"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{ cursor: gameFinished ? 'default' : 'pointer' }}
            >
              {dropText}
            </div>

            <p id="result" style={{ marginTop: '14px', fontWeight: 800 }}>
              {resultMsg}
            </p>

            <button onClick={restartGame}>Restart Game 🔄</button>
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

export default GamesPage;