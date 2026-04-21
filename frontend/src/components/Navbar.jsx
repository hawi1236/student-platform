import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">EduShare</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/materials">Materials</Link>
          <Link to="/qa">Q&A</Link>
          {token ? (
            <>
              <Link to="/upload">Upload</Link>
              <span className="user-name">Hi, {user?.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
