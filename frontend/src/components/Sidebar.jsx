import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Upload, 
  MessageCircle, 
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Materials', path: '/materials', icon: BookOpen },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'My Uploads', path: '/profile', icon: FileText },
    { name: 'Q&A Forum', path: '/qa', icon: MessageCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <ShieldCheck size={24} />
          </div>
          <span className="logo-text">EduShare</span>
        </Link>
      </div>

      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav">
        <p className="nav-label">Main Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <item.icon size={20} />
            </div>
            <span>{item.name}</span>
            {isActive(item.path) && <ChevronRight size={14} className="active-indicator" />}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom-badge">
        <div className="pro-badge">
          <span>{user?.role === 'admin' ? 'Admin Access' : 'Student Pro'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
