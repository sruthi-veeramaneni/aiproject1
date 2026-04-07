import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, GraduationCap, Store } from 'lucide-react';

const AuthCard = ({ title, role, icon: Icon, allowSignup = true }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const result = await login(email, password, role);
      if (!result.success) {
        setError(result.message || 'Invalid email or password');
      }
    } else {
      const result = await register(name, email, password, role);
      if (!result.success) {
        setError(result.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="glass-panel" style={{ flex: '1 1 350px', maxWidth: '450px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Icon size={28} className="text-gradient" />
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        {isLogin ? `Sign in to your ${role} account` : `Create a new ${role} account`}
      </p>
      
      {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
        {!isLogin && (
          <div>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isLogin ? <><LogIn size={20} /> Login as {role === 'student' ? 'Student' : 'Owner'}</> : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </div>
      </form>
      
      {allowSignup && (
        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          {' '}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Canteen Connect</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Welcome to the future of campus dining. Choose your portal below to get started.
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>
        <AuthCard title="Student Portal" role="student" icon={GraduationCap} />
        <AuthCard title="Canteen Owner Portal" role="owner" icon={Store} allowSignup={false} />
      </div>
    </div>
  );
};

export default Home;
