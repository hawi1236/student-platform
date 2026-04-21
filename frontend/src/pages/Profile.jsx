import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MaterialCard from '../components/MaterialCard';
import { 
  User, 
  Mail, 
  Shield, 
  FileText, 
  Trash2, 
  Download, 
  ExternalLink,
  Settings,
  Grid,
  List
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [myMaterials, setMyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('uploads');

  useEffect(() => {
    const fetchMyMaterials = async () => {
      try {
        const res = await api.get('/materials');
        // Filter materials by current user ID
        const filtered = res.data.filter(m => m.userId === user?._id || m.user?._id === user?._id);
        setMyMaterials(filtered);
      } catch (err) {
        console.error('Failed to fetch your materials:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyMaterials();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this resource? This action cannot be undone.')) return;
    try {
      await api.delete(`/materials/${id}`);
      setMyMaterials(myMaterials.filter(m => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="profile-view animate-fade-in">
      <div className="profile-header-box glass-card mb-10">
        <div className="profile-bg-pattern"></div>
        <div className="profile-info-content">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0)}
          </div>
          <div className="profile-text">
            <h1 className="profile-name">{user?.name}</h1>
            <div className="profile-badges">
              <div className="badge role">
                <Shield size={12} />
                <span>{user?.role}</span>
              </div>
              <div className="badge email">
                <Mail size={12} />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="profile-actions-top">
            <button className="btn-icon-outline"><Settings size={20} /></button>
          </div>
        </div>
      </div>

      <div className="profile-content-tabs mb-6">
        <button 
          className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploads')}
        >
          <FileText size={18} />
          <span>My Uploads</span>
          <span className="tab-count">{myMaterials.length}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Grid size={18} />
          <span>Activity</span>
        </button>
      </div>

      <div className="profile-grid">
        {loading ? (
          <div className="text-center py-20 w-full">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-dim">Fetching your contributions...</p>
          </div>
        ) : activeTab === 'uploads' ? (
          myMaterials.length > 0 ? (
            <div className="my-materials-list">
              {myMaterials.map((m) => (
                <div key={m._id} className="my-material-row glass-card">
                  <div className="m-icon">
                    <FileText size={24} />
                  </div>
                  <div className="m-info">
                    <h4>{m.title}</h4>
                    <p>{m.course}</p>
                  </div>
                  <div className="m-date">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                  <div className="m-actions">
                    <a 
                      href={`http://localhost:5000/${m.filePath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="m-action-btn view"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button 
                      onClick={() => handleDelete(m._id)}
                      className="m-action-btn delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-profile-state glass-card">
              <FileText size={48} className="text-dim opacity-20 mb-4" />
              <h3>No uploads yet</h3>
              <p>You haven't shared any study materials yet. Start contributing today!</p>
            </div>
          )
        ) : (
          <div className="empty-profile-state glass-card">
            <Grid size={48} className="text-dim opacity-20 mb-4" />
            <h3>Activity log is empty</h3>
            <p>Your recent actions will appear here.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-view { width: 100%; max-width: 1000px; margin: 0 auto; }
        
        .profile-header-box { 
          position: relative; 
          padding: 3rem; 
          overflow: hidden;
          border-radius: 24px;
        }

        .profile-bg-pattern {
          position: absolute;
          top: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          opacity: 0.15;
          z-index: 0;
        }

        .profile-info-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          margin-top: 2rem;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          background: var(--bg-card);
          border: 4px solid var(--bg-surface);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary-light);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .profile-text { flex: 1; }
        .profile-name { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
        .profile-badges { display: flex; gap: 0.75rem; }
        .badge { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          padding: 0.4rem 0.75rem; 
          background: rgba(255,255,255,0.05); 
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .profile-content-tabs { display: flex; gap: 1rem; border-bottom: 1px solid var(--glass-border); }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-weight: 700;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .tab-btn.active { color: white; }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .tab-count {
          background: rgba(255,255,255,0.08);
          padding: 0.1rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
        }

        .my-materials-list { display: flex; flex-direction: column; gap: 1rem; }
        .my-material-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem 2rem;
          transition: all 0.2s;
        }
        .my-material-row:hover { border-color: var(--primary); transform: translateX(5px); }
        
        .m-icon { width: 48px; height: 48px; background: rgba(99, 102, 241, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary-light); }
        .m-info { flex: 1; }
        .m-info h4 { color: white; font-weight: 700; margin-bottom: 2px; }
        .m-info p { font-size: 0.85rem; color: var(--text-dim); }
        .m-date { font-size: 0.85rem; color: var(--text-dim); font-weight: 600; }
        .m-actions { display: flex; gap: 0.75rem; }
        
        .m-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          transition: all 0.2s;
          cursor: pointer;
        }
        .m-action-btn.view:hover { color: var(--primary-light); background: rgba(99, 102, 241, 0.1); }
        .m-action-btn.delete:hover { color: var(--danger); background: rgba(239, 68, 68, 0.1); }

        .empty-profile-state { padding: 4rem; text-align: center; display: flex; flex-direction: column; align-items: center; }
        
        @media (max-width: 768px) {
          .profile-info-content { flex-direction: column; align-items: center; text-align: center; }
          .profile-badges { justify-content: center; }
          .my-material-row { flex-direction: column; text-align: center; gap: 1rem; }
          .m-date { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
