import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, User, ShieldCheck, ArrowRight, Github } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = "https://xplore-math-learning-app-backend.vercel.app";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          // Store token and redirect to home/dashboard
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/home');
        } else {
          // After registration, switch to login view
          setIsLogin(true);
          setError('Account created! Please log in.');
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection refused. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-decor">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
      </div>

      <div className="login-container">

        <main className="auth-pane animate-slideUp">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-ring"><ShieldCheck size={32} /></div>
              <h1>{isLogin ? 'Welcome Back' : 'Join XploreMath'}</h1>
              <p>Access your modules and track your progress today.</p>
            </div>

            <div className="auth-tabs">
              <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Register</button>
              <div className={`tab-slider ${isLogin ? 'left' : 'right'}`}></div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="input-group">
                  <User size={18} />
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} />
                </div>
              )}
              <div className="input-group">
                <Mail size={18} />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <Lock size={18} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {error && <div className={`message-box ${error.includes('created') ? 'success' : 'error'}`}>{error}</div>}

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;