import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusbite_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusbite_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate token on mount
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Token expired');
          return res.json();
        })
        .then(data => {
          setUser(data.user);
          localStorage.setItem('campusbite_user', JSON.stringify(data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('campusbite_token', data.token);
    localStorage.setItem('campusbite_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, student_id, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, student_id, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('campusbite_token', data.token);
    localStorage.setItem('campusbite_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campusbite_token');
    localStorage.removeItem('campusbite_user');
  };

  // Quick Demo Logins for hassle-free demonstration
  const loginAsStudent = async () => {
    return login('rahul@campus.edu', 'student123');
  };

  const loginAsAdmin = async () => {
    return login('admin@campusbite.com', 'admin123');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      loginAsStudent,
      loginAsAdmin,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
