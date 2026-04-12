// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: if a token exists in localStorage, fetch the user's data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set default Authorization header para sa lahat ng kasunod na requests
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      API.get('/auth/me')
        .then(res => {
          // Siguraduhin na ang response ay may kasamang `role` field
          // Halimbawa: { _id, name, email, role: 'admin' o 'user' }
          setUser(res.data);
        })
        .catch(() => {
          // Remove bad token
          localStorage.removeItem('token');
          delete API.defaults.headers.common['Authorization'];
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login: tawag sa backend, i-save ang token at user (kasama ang role)
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    // data should contain: { token, user: { _id, name, email, role, ... } }
    localStorage.setItem('token', data.token);
    // Itakda ang Authorization header para sa susunod na requests
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user; // return user para magamit ng caller (kung gusto nilang i-check agad ang role)
  };

  // Logout: tanggalin ang token at i-reset ang user
  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Helper: suriin kung ang user ay admin (kung may user at role === 'admin')
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook — gamitin ito sa halip na useContext(AuthContext) sa lahat ng components
export const useAuth = () => useContext(AuthContext);