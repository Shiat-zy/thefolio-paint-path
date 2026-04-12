import { useState } from 'react';
import API from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setMessage('Error sending request');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
