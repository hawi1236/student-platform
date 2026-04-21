import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  User, 
  Send, 
  Plus, 
  MessageCircle, 
  Search,
  Filter,
  Trophy,
  ArrowUp,
  Clock,
  MoreVertical,
  Trash2
} from 'lucide-react';

const QA = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answerContent, setAnswerContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/qa');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/qa', { title, content });
      setTitle('');
      setContent('');
      setShowForm(false);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post question');
    }
  };

  const handleAnswer = async (questionId) => {
    const content = answerContent[questionId];
    if (!content) return;

    try {
      await api.post(`/qa/${questionId}/answers`, { content });
      setAnswerContent({ ...answerContent, [questionId]: '' });
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post answer');
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question and all its answers?')) return;
    try {
      await api.delete(`/qa/${id}`);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Delete your answer?')) return;
    try {
      await api.delete(`/qa/answers/${answerId}`);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="forum-view animate-fade-in">
      <header className="forum-header">
        <div className="header-info">
          <h1 className="heading-lg">Student Q&A Forum</h1>
          <p className="text-muted">Exchange knowledge, solve problems, and grow together.</p>
        </div>
        <div className="header-actions">
          <div className="forum-search">
            <Search size={18} className="search-icon-forum" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`btn-ask ${showForm ? 'cancel' : ''}`}
          >
            {showForm ? <Plus style={{ transform: 'rotate(45deg)' }} size={20} /> : <Plus size={20} />}
            <span>{showForm ? 'Cancel' : 'Ask Question'}</span>
          </button>
        </div>
      </header>

      <div className="forum-layout">
        <main className="forum-main">
          {showForm && (
            <div className="ask-form-card glass-card animate-fade-in">
              <div className="card-head">
                <MessageSquare size={20} className="text-primary-light" />
                <h3>New Question</h3>
              </div>
              <form onSubmit={handleAskQuestion} className="ask-form">
                <input 
                  type="text" 
                  className="forum-input" 
                  placeholder="Summarize your problem in a title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea 
                  className="forum-textarea" 
                  placeholder="Explain your question in detail... what have you tried?" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <div className="form-footer">
                  <button type="submit" className="btn btn-primary">Post to Forum</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="forum-loader">
              <div className="spinner"></div>
              <p>Loading discussions...</p>
            </div>
          ) : (
            <div className="discussion-list">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <div key={q._id} className="discussion-card glass-card">
                    <div className="d-card-sidebar">
                      <button className="vote-btn"><ArrowUp size={20} /></button>
                      <span className="vote-count">{q.answers?.length || 0}</span>
                      <p className="vote-label">Replies</p>
                    </div>
                    
                    <div className="d-card-content">
                      <div className="d-meta">
                        <div className="d-user">
                          <div className="d-avatar">{q.user?.name?.charAt(0)}</div>
                          <span className="d-username">{q.user?.name}</span>
                        </div>
                        <span className="d-date"><Clock size={12} /> {new Date(q.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        {(user?.role === 'admin' || user?.id === q.user?._id) && (
                          <button 
                            onClick={() => handleDeleteQuestion(q._id)} 
                            className="btn-delete-forum"
                            title="Delete question"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      <h3 className="d-title">{q.title}</h3>
                      <p className="d-snippet">{q.content}</p>

                      {q.answers && q.answers.length > 0 && (
                        <div className="d-answers-preview">
                          <p className="ans-label">{expandedQuestions[q._id] ? 'All Answers' : 'Top Answer'}</p>
                          
                          <div className="answers-container">
                            {(expandedQuestions[q._id] ? q.answers : [q.answers[0]]).map((ans, idx) => (
                              <div key={ans._id || idx} className="answer-item">
                                <div className="ans-meta">
                                  <div className="ans-user-avatar">{ans.user?.name?.charAt(0)}</div>
                                  <span className="ans-user">{ans.user?.name}</span>
                                  <span className="ans-date">{new Date(ans.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                  {(user?.role === 'admin' || user?.id === (ans.user?._id || ans.user)) && (
                                    <button 
                                      onClick={() => handleDeleteAnswer(ans._id)} 
                                      className="btn-delete-forum"
                                      title="Delete answer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                                <p className="ans-text">{ans.content}</p>
                              </div>
                            ))}
                          </div>

                          {q.answers.length > 1 && (
                            <button 
                              onClick={() => toggleExpand(q._id)} 
                              className="btn-view-all"
                            >
                              {expandedQuestions[q._id] 
                                ? 'Show less' 
                                : `View ${q.answers.length - 1} more answers`}
                            </button>
                          )}
                        </div>
                      )}

                      <div className="d-reply-box">
                        <div className="reply-input-wrapper">
                          <input 
                            type="text" 
                            placeholder="Write your answer..." 
                            value={answerContent[q._id] || ''}
                            onChange={(e) => setAnswerContent({ ...answerContent, [q._id]: e.target.value })}
                          />
                          <button 
                            onClick={() => handleAnswer(q._id)}
                            className="btn-send"
                            disabled={!answerContent[q._id]}
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="forum-empty text-center">
                  <MessageCircle size={64} className="empty-icon" />
                  <h3>No discussions found</h3>
                  <p>Try searching for something else or start a new conversation.</p>
                </div>
              )}
            </div>
          )}
        </main>

        <aside className="forum-sidebar">
          <div className="glass-card sidebar-stat-card">
            <h4 className="flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-warning" />
              <span>Community Leaders</span>
            </h4>
            <div className="leader-list">
              <div className="leader-item">
                <div className="l-avatar">A</div>
                <div className="l-info">
                  <p className="l-name">Alex Johnson</p>
                  <p className="l-stats">128 Answers</p>
                </div>
              </div>
              <div className="leader-item">
                <div className="l-avatar secondary">M</div>
                <div className="l-info">
                  <p className="l-name">Maria Garcia</p>
                  <p className="l-stats">94 Answers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card help-card">
            <h4>Forum Rules</h4>
            <ul className="rules-list">
              <li>Be polite and helpful</li>
              <li>Don't post spam</li>
              <li>Use clear titles</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QA;
