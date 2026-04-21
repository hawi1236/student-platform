import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Materials from './pages/Materials';
import Upload from './pages/Upload';
import QA from './pages/QA';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/register" element={<Auth type="register" />} />

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="materials" element={<Materials />} />
            <Route path="upload" element={<Upload />} />
            <Route path="qa" element={<QA />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
