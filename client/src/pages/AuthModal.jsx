import React, { useState } from 'react';
import { X, User, Mail, Lock, GraduationCap, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab); // 'login' | 'register' | 'admin'
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, loginAsStudent, loginAsAdmin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login' || tab === 'admin') {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your name');
        if (!studentId.trim()) throw new Error('Please enter your Student ID');
        await register(name, studentId, email, password);
      }
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent1 = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsStudent();
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent2 = async () => {
    setError('');
    setLoading(true);
    try {
      await login('priya@campus.edu', 'student123');
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsAdmin();
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Tab switchers */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'login' ? 'btn-primary' : ''}`}
            style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Student Sign In
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'register' ? 'btn-primary' : ''}`}
            style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'admin' ? 'btn-primary' : ''}`}
            style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}
            onClick={() => { setTab('admin'); setError(''); }}
          >
            Admin Staff
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            {tab === 'login' && 'Student Login'}
            {tab === 'register' && 'Create Student Account'}
            {tab === 'admin' && 'Canteen Admin Login'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {tab === 'login' && 'Sign in to order food, save cart and track orders'}
            {tab === 'register' && 'Join CampusBite to order seamlessly from campus canteen'}
            {tab === 'admin' && 'Authorized canteen management portal'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Student ID Number</label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="e.g. CS2024-042"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">{tab === 'admin' ? 'Staff Email' : 'Campus Email'}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={tab === 'admin' ? 'admin@campusbite.com' : 'student@campus.edu'}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Please wait...' : tab === 'register' ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={14} /> Quick Demo Login (One-Click)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDemoStudent1}
              style={{ justifyContent: 'space-between', fontSize: '0.84rem' }}
            >
              <span>🧑‍🎓 Student: <strong>Rahul Sharma</strong></span>
              <span style={{ color: 'var(--text-light)' }}>CS2024-042</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDemoStudent2}
              style={{ justifyContent: 'space-between', fontSize: '0.84rem' }}
            >
              <span>👩‍🎓 Student: <strong>Priya Patel</strong></span>
              <span style={{ color: 'var(--text-light)' }}>EC2024-118</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDemoAdmin}
              style={{ justifyContent: 'space-between', fontSize: '0.84rem', borderColor: '#fed7aa', background: '#fff7ed' }}
            >
              <span>👨‍🍳 Staff: <strong>Canteen Manager</strong></span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Admin Role</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
