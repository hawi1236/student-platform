import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MaterialCard from '../components/MaterialCard';
import { 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus, 
  ArrowRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ materials: 0, questions: 0 });
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, questionsRes] = await Promise.all([
          api.get('/materials'),
          api.get('/qa')
        ]);
        setStats({
          materials: materialsRes.data.length,
          questions: questionsRes.data.length
        });
        setRecentMaterials(materialsRes.data.slice(0, 4));
        setTopQuestions(questionsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  const statsItems = [
    { label: 'Study Materials', value: stats.materials, icon: BookOpen, color: 'primary' },
    { label: 'Open Questions', value: stats.questions, icon: MessageSquare, color: 'secondary' },
    { label: 'Active Students', value: 124, icon: Users, color: 'accent' },
    { label: 'New Activity', value: '+12', icon: TrendingUp, color: 'warning' },
  ];

  return (
    <div className="home-page animate-fade-in">
      {/* Welcome Banner */}
      <section className="welcome-banner mb-8">
        <div className="banner-content">
          <div className="banner-text">
            <span className="badge badge-primary mb-4">Academic Semester 2026</span>
            <h1 className="heading-xl">Boost your learning, <br /><span className="text-gradient">together.</span></h1>
            <p className="text-muted max-w-md">Access shared notes, ask difficult questions, and collaborate with your fellow students in one place.</p>
            <div className="flex gap-4 mt-8">
              <Link to="/upload" className="btn btn-primary">
                <Plus size={18} />
                <span>Share Resource</span>
              </Link>
              <Link to="/materials" className="btn btn-outline">
                <span>Browse Notes</span>
              </Link>
            </div>
          </div>
          <div className="banner-visual">
            <div className="floating-card c1">📚</div>
            <div className="floating-card c2">🎓</div>
            <div className="floating-card c3">💡</div>
          </div>
        </div>
      </section>

      {/* Stats Grid - Now 4 columns */}
      <div className="stats-grid-v2 mb-12">
        {statsItems.map((item, idx) => (
          <div key={idx} className="glass-card stat-card-v2">
            <div className={`icon-circle ${item.color}`}>
              <item.icon size={20} />
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{item.value}</h3>
              <p className="stat-label">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="home-main-grid">
        {/* Left Column: Recent Materials */}
        <section className="recent-section">
          <div className="section-header flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="header-icon"><Clock size={20} /></div>
              <h2 className="heading-md mb-0">Recently Shared</h2>
            </div>
            <Link to="/materials" className="view-all">
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="materials-grid-home">
            {recentMaterials.length > 0 ? (
              recentMaterials.map((m) => (
                <MaterialCard key={m._id} material={m} onDelete={() => {}} />
              ))
            ) : (
              <div className="empty-state glass-card">
                <p>No materials shared yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Trending / Community */}
        <aside className="community-sidebar">
          <div className="glass-card mb-6">
            <h3 className="heading-md mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-secondary" />
              <span>Trending Questions</span>
            </h3>
            <div className="questions-list-mini">
              {topQuestions.length > 0 ? (
                topQuestions.map((q) => (
                  <Link key={q._id} to="/qa" className="mini-q-item">
                    <p className="q-title">{q.title}</p>
                    <div className="q-meta">
                      <span className="q-count">{q.answers?.length || 0} answers</span>
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-dim">No questions yet.</p>
              )}
            </div>
            <Link to="/qa" className="btn btn-ghost w-full mt-4 text-xs">Go to Forum</Link>
          </div>

          <div className="glass-card upgrade-card">
            <div className="upgrade-content">
              <h4>Want to contribute?</h4>
              <p>Top contributors get special badges and priority support.</p>
              <Link to="/upload" className="btn btn-primary w-full mt-4">Start Sharing</Link>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .welcome-banner {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 4rem;
          position: relative;
          overflow: hidden;
        }

        .banner-content { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
        .max-w-md { max-width: 450px; }

        .banner-visual { position: relative; width: 300px; height: 200px; }
        .floating-card {
          position: absolute;
          width: 80px;
          height: 80px;
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          animation: float 6s ease-in-out infinite;
        }

        .c1 { top: 0; left: 0; animation-delay: 0s; }
        .c2 { top: 60px; right: 0; animation-delay: 2s; }
        .c3 { bottom: 0; left: 80px; animation-delay: 4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .stats-grid-v2 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .stat-card-v2 {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
        }

        .icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-circle.primary { background: rgba(99, 102, 241, 0.15); color: var(--primary-light); }
        .icon-circle.secondary { background: rgba(236, 72, 153, 0.15); color: var(--secondary); }
        .icon-circle.accent { background: rgba(16, 185, 129, 0.15); color: var(--accent); }
        .icon-circle.warning { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

        .stat-value { font-size: 1.5rem; font-weight: 800; line-height: 1; margin-bottom: 2px; }
        .stat-label { font-size: 0.8rem; color: var(--text-dim); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        .home-main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2.5rem; }

        .section-header .header-icon {
          width: 36px;
          height: 36px;
          background: var(--glass-bg);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-light);
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .view-all:hover { color: var(--primary-light); }

        .materials-grid-home {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .mini-q-item {
          display: block;
          padding: 1rem;
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          text-decoration: none;
          margin-bottom: 0.75rem;
          transition: background 0.2s;
          border: 1px solid transparent;
        }
        .mini-q-item:hover { background: var(--glass-bg); border-color: var(--glass-border); }
        .q-title { font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
        .q-meta { display: flex; justify-content: space-between; align-items: center; color: var(--text-dim); font-size: 0.75rem; }

        .upgrade-card {
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          color: white;
          text-align: center;
        }
        .upgrade-card h4 { font-weight: 700; margin-bottom: 8px; }
        .upgrade-card p { font-size: 0.85rem; opacity: 0.9; }
        .upgrade-card .btn-primary { background: white; color: var(--primary); border: none; }
        .upgrade-card .btn-primary:hover { background: #f8fafc; color: var(--primary-dark); }

        @media (max-width: 1200px) {
          .stats-grid-v2 { grid-template-columns: repeat(2, 1fr); }
          .home-main-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .welcome-banner { padding: 2rem; }
          .banner-visual { display: none; }
          .stats-grid-v2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Home;
