import { Routes, Route } from 'react-router-dom';
// TINANGGAL: import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage'; 
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import GamesPage from './pages/GamesPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<SplashPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/posts/:id' element={<PostPage />} />
        <Route path='/games' element={<GamesPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/create-post'
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-post/:id'
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute role='admin'>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;