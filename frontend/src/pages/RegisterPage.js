// frontend/src/pages/RegisterPage.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

// Simple guest navbar – kung may existing Navbar component, i-import na lang at palitan ito
const GuestNavbar = () => {
  return (
    <nav className="guest-navbar">
      <div className="nav-container">
        <div className="logo">
          <Link to="/">🎨 Paint Path</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register" className="active">Register</Link></li>
        </ul>
      </div>
    </nav>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    dob: '',
    terms: '',
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordTimeout = useRef(null);
  const confirmTimeout = useRef(null);

  // API feedback
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Refs
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const dobRef = useRef(null);
  const termsRef = useRef(null);

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const showError = (field, message, ref) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ref.current.focus();
    }
  };

  const isValidAge = (dobString) => {
    if (!dobString) return false;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 13;
  };

  const validateForm = () => {
    let isValid = true;
    let firstInvalidRef = null;

    if (!fullName.trim()) {
      showError('fullName', 'Please enter your full name', fullNameRef);
      firstInvalidRef = fullNameRef;
      isValid = false;
    } else if (fullName.trim().length < 3) {
      showError('fullName', 'Full name must be at least 3 characters', fullNameRef);
      firstInvalidRef = fullNameRef;
      isValid = false;
    } else {
      clearError('fullName');
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim()) {
      showError('email', 'Please enter your email', emailRef);
      if (!firstInvalidRef) firstInvalidRef = emailRef;
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('email', 'Enter a valid email address', emailRef);
      if (!firstInvalidRef) firstInvalidRef = emailRef;
      isValid = false;
    } else {
      clearError('email');
    }

    if (!password) {
      showError('password', 'Please create a password', passwordRef);
      if (!firstInvalidRef) firstInvalidRef = passwordRef;
      isValid = false;
    } else if (password.length < 8 || password.length > 20) {
      showError('password', 'Password must be 8–20 characters', passwordRef);
      if (!firstInvalidRef) firstInvalidRef = passwordRef;
      isValid = false;
    } else {
      clearError('password');
    }

    if (!confirmPassword) {
      showError('confirm', 'Please confirm your password', confirmRef);
      if (!firstInvalidRef) firstInvalidRef = confirmRef;
      isValid = false;
    } else if (password !== confirmPassword) {
      showError('confirm', 'Passwords do not match', confirmRef);
      if (!firstInvalidRef) firstInvalidRef = confirmRef;
      isValid = false;
    } else {
      clearError('confirm');
    }

    if (!dob) {
      showError('dob', 'Please enter your date of birth', dobRef);
      if (!firstInvalidRef) firstInvalidRef = dobRef;
      isValid = false;
    } else if (!isValidAge(dob)) {
      showError('dob', 'You must be at least 13 years old', dobRef);
      if (!firstInvalidRef) firstInvalidRef = dobRef;
      isValid = false;
    } else {
      clearError('dob');
    }

    if (!agreeTerms) {
      showError('terms', 'You must agree to the terms', termsRef);
      if (!firstInvalidRef) firstInvalidRef = termsRef;
      isValid = false;
    } else {
      clearError('terms');
    }

    if (!isValid && firstInvalidRef?.current) {
      firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstInvalidRef.current.tagName === 'INPUT') firstInvalidRef.current.focus();
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    if (!validateForm()) return;
    try {
      const { data } = await API.post('/auth/register', {
        name: fullName,
        email: email,
        password: password,
        dob: dob,
      });
      localStorage.setItem('token', data.token);
      setSuccessMessage('✅ Registration successful! Welcome to Paint Path!');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDob('');
      setAgreeTerms(false);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(msg);
      if (msg.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: msg }));
      }
    }
  };

  const handleCancel = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDob('');
    setAgreeTerms(false);
    setApiError('');
    setSuccessMessage('');
    navigate('/login');
  };

  const handlePasswordToggle = () => {
    setShowPassword(prev => !prev);
    if (showPassword) clearTimeout(passwordTimeout.current);
    else passwordTimeout.current = setTimeout(() => setShowPassword(false), 3000);
  };

  const handleConfirmToggle = () => {
    setShowConfirm(prev => !prev);
    if (showConfirm) clearTimeout(confirmTimeout.current);
    else confirmTimeout.current = setTimeout(() => setShowConfirm(false), 3000);
  };

  useEffect(() => {
    if (errors.fullName) clearError('fullName');
  }, [fullName, errors.fullName]);

  useEffect(() => {
    if (errors.email) clearError('email');
  }, [email, errors.email]);

  useEffect(() => {
    if (errors.password) clearError('password');
  }, [password, errors.password]);

  useEffect(() => {
    if (errors.confirm) clearError('confirm');
  }, [confirmPassword, errors.confirm]);

  useEffect(() => {
    if (errors.dob) clearError('dob');
  }, [dob, errors.dob]);

  return (
    <>
      <GuestNavbar />
      <section className="home-wrapper" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="register-page" style={{ maxWidth: '500px', width: '100%', margin: '0 auto', padding: '40px 20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Join the Paint Path Community</h2>

          {apiError && <div className="api-error-message">{apiError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit} noValidate className="glass-form">
            {/* Full Name */}
            <div className="input-wrapper">
              <input type="text" ref={fullNameRef} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
              {errors.fullName && <span className="error-tooltip">{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className="input-wrapper">
              <input type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              {errors.email && <span className="error-tooltip">{errors.email}</span>}
            </div>

            {/* Password with eye */}
            <div className="input-wrapper password-field">
              <input type={showPassword ? 'text' : 'password'} ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8-20 characters)" />
              <button type="button" className="eye-icon" onClick={handlePasswordToggle} tabIndex="-1">
                {showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && <span className="error-tooltip">{errors.password}</span>}
            </div>

            {/* Confirm Password with eye */}
            <div className="input-wrapper password-field">
              <input type={showConfirm ? 'text' : 'password'} ref={confirmRef} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
              <button type="button" className="eye-icon" onClick={handleConfirmToggle} tabIndex="-1">
                {showConfirm ? '🙈' : '👁️'}
              </button>
              {errors.confirm && <span className="error-tooltip">{errors.confirm}</span>}
            </div>

            {/* Date of Birth */}
            <div className="input-wrapper">
              <input type="date" ref={dobRef} value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of Birth" />
              {errors.dob && <span className="error-tooltip">{errors.dob}</span>}
            </div>

            {/* Terms */}
            <div className="terms-wrapper">
              <label>
                <input type="checkbox" ref={termsRef} checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                I agree to the terms and conditions
              </label>
              {errors.terms && <span className="error-tooltip">{errors.terms}</span>}
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button type="submit">Register</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </section>

      <style>{`
        /* Guest Navbar Styles */
        .guest-navbar {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .guest-navbar .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .guest-navbar .logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
          letter-spacing: 1px;
        }
        .guest-navbar .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .guest-navbar .nav-links li a {
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          font-weight: 500;
          transition: 0.3s;
          padding: 0.5rem 0;
        }
        .guest-navbar .nav-links li a:hover,
        .guest-navbar .nav-links li a.active {
          color: #ff6b6b;
          border-bottom: 2px solid #ff6b6b;
        }
        @media (max-width: 600px) {
          .guest-navbar .nav-container {
            flex-direction: column;
            gap: 0.5rem;
          }
          .guest-navbar .nav-links {
            gap: 1rem;
          }
        }

        /* Original Register Page Styles (slightly adjusted) */
        .register-page .glass-form {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          padding: 35px 30px;
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        .register-page .input-wrapper {
          position: relative;
          margin-bottom: 20px;
        }
        .register-page input {
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
        }
        .register-page input:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 12px rgba(255,107,107,0.4);
          background: rgba(255,255,255,0.2);
        }
        .register-page input::placeholder {
          color: rgba(255,255,255,0.7);
        }
        .password-field {
          position: relative;
        }
        .password-field input {
          padding-right: 45px;
        }
        .eye-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
          margin: 0;
          color: rgba(255,255,255,0.7);
          transition: color 0.2s;
        }
        .eye-icon:hover {
          color: #ff6b6b;
        }
        .error-tooltip {
          position: absolute;
          right: 0;
          top: -10px;
          background: rgba(255, 70, 70, 0.9);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          color: white;
          border: 1px solid rgba(255, 100, 100, 0.6);
          white-space: nowrap;
          z-index: 10;
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
        .success-message {
          background: rgba(76, 175, 80, 0.2);
          border-left: 4px solid #4caf50;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          color: #ccffcc;
          text-align: center;
          backdrop-filter: blur(4px);
          font-weight: bold;
        }
        .terms-wrapper {
          position: relative;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
        }
        .terms-wrapper label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.9);
          cursor: pointer;
        }
        .terms-wrapper input {
          width: auto;
          margin: 0;
        }
        .button-group {
          display: flex;
          gap: 15px;
        }
        .button-group button {
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .button-group button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,107,107,0.4);
        }
        .button-group button:last-child {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
        }
        .register-page p a {
          color: #ffcccc;
          text-decoration: none;
          font-weight: 600;
        }
        .register-page p a:hover {
          color: #ff6b6b;
        }
        body.dark-mode .register-page .glass-form {
          background: rgba(30,30,40,0.7);
          border-color: rgba(255,255,255,0.15);
        }
        body.dark-mode .register-page input {
          background: rgba(0,0,0,0.3);
          color: #eee;
        }
        @media (max-width: 600px) {
          .register-page .glass-form {
            padding: 25px 20px;
          }
          .error-tooltip {
            white-space: normal;
            font-size: 0.65rem;
            max-width: 180px;
            text-align: right;
            top: -28px;
          }
        }
      `}</style>
    </>
  );
};

export default RegisterPage;