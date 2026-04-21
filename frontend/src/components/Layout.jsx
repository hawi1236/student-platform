import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Search, Bell, Menu, LogOut, User, ChevronDown, Settings, X, MessageSquare, FileText, Clock } from 'lucide-react';

const Layout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate(`/materials?search=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch('');
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Preparing your workspace...</p>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-container">
        <header className="top-nav">
          <div className="nav-left">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="global-search-input" 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={handleGlobalSearch}
              />
              <div className="search-shortcut">↵</div>
            </div>
          </div>

          <div className="nav-right">
            <div className="notification-area" ref={notificationRef}>
              <button 
                className={`nav-icon-btn ${showNotifications ? 'active' : ''}`} 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) fetchNotifications();
                }}
                title="Notifications"
              >
                <Bell size={20} />
                {notifications.length > 0 && <span className="notification-badge"></span>}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="notification-dropdown glass-card"
                  >
                    <div className="notif-header">
                      <span>Recent Activity</span>
                      <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                    </div>
                    <div className="notif-list">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className="notif-item">
                            <div className={`notif-icon-box ${n.type}`}>
                              {n.type === 'qa' ? <MessageSquare size={14} /> : <FileText size={14} />}
                            </div>
                            <div className="notif-content">
                              <p className="notif-text">{n.text}</p>
                              <span className="notif-time"><Clock size={10} className="inline mr-1" />{getTimeAgo(n.createdAt)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-dim text-sm">
                          No recent activity to show
                        </div>
                      )}
                    </div>
                    <div className="notif-footer">
                      <button onClick={fetchNotifications}>Refresh Feed</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="nav-divider"></div>
            
            <div className="nav-user-area" ref={dropdownRef}>
              <button 
                className="user-profile-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar-top">
                  {user.name.charAt(0)}
                </div>
                <div className="user-text-top hidden sm:block">
                  <p className="user-name-top">{user.name}</p>
                  <p className="user-role-top">{user.role}</p>
                </div>
                <ChevronDown size={14} className={`arrow-icon ${showDropdown ? 'rotate' : ''}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="user-dropdown-menu"
                  >
                    <div className="dropdown-header">
                      <p className="d-name">{user.name}</p>
                      <p className="d-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={logout} className="dropdown-item logout-item">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
