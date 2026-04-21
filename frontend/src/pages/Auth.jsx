import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import authBg from '../assets/auth-bg.png';

const Auth = ({ type }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isLogin = type === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await api.post(endpoint, payload);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Unlimited resource sharing",
    "Real-time Q&A forum",
    "Secure student verification",
    "Direct material downloads"
  ];

  return (
    <div className="auth-split-layout">
      {/* Left Side: Visual Showcase */}
      <div className="auth-visual-side">
        <div className="auth-visual-overlay"></div>
        <img src={authBg} alt="Background" className="auth-visual-img" />
        
        <div className="auth-visual-content">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="logo-container mb-12"
          >
            <div className="logo-icon scale-125">
              <ShieldCheck size={28} />
            </div>
            <span className="heading-lg logo-text-gradient text-3xl">EduShare</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-extrabold text-white mb-6 leading-tight"
          >
            Empowering Students <br /> 
            <span className="text-primary-light">Through Knowledge Sharing</span>
          </motion.h2>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                className="flex items-center gap-3 text-white/80"
              >
                <CheckCircle2 size={20} className="text-accent" />
                <span className="font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-auto pt-20"
          >
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-base bg-glass-highlight flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-bg-base bg-primary flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-white/60 text-sm">Join over 2,000+ students already sharing resources.</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card auth-card-split"
        >
          <div className="mb-10">
            <h1 className="heading-md text-2xl mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-dim">
              {isLogin ? 'Please enter your details to sign in' : 'Complete the form to join the community'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '0rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="input-group"
                >
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
                    <input
                      type="text"
                      className="input-field pl-12"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
                <input
                  type="email"
                  className="input-field pl-12"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
                <input
                  type="password"
                  className="input-field pl-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="error-msg"
              >
                {error}
              </motion.p>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn btn-primary w-full mt-4 h-[56px]" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span className="text-lg">{isLogin ? 'Sign In' : 'Get Started'}</span>
                  {isLogin ? <ArrowRight size={20} /> : <Sparkles size={20} />}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-muted">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <Link to={isLogin ? '/register' : '/login'} className="text-primary-light font-bold hover:text-primary transition-colors ml-1">
                {isLogin ? 'Sign Up Free' : 'Log In Now'}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
