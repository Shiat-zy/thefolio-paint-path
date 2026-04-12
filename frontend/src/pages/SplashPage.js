import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const [dotCount, setDotCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      // ✅ Tamang route: '/home' para sa guest
      setTimeout(() => navigate('/home'), 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="logo">
        <img src="/assets/logo.png" alt="Paint Path Logo" />
      </div>
      <h1>Paint Path</h1>
      <div className="spinner"></div>
      <div className="loading-text">
        Loading<span className="dots">{'.'.repeat(dotCount)}</span>
      </div>
    </div>
  );
};

export default SplashPage;