import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kisan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);
      const userData = data.user || data;
      
      setUser(userData);
      localStorage.setItem('kisan_user', JSON.stringify(userData));
      if (data.token) localStorage.setItem('kisan_token', data.token);
      
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      const userObj = data.user || data;
      
      setUser(userObj);
      localStorage.setItem('kisan_user', JSON.stringify(userObj));
      if (data.token) localStorage.setItem('kisan_token', data.token);
      
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout notification error:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem('kisan_user');
      localStorage.removeItem('kisan_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);