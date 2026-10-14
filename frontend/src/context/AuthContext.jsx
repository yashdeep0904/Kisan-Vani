import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kisan_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(false);
  
  // 1. Add Modal Global State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);
      const userData = data.user || data;
      const token = data.token || data.accessToken || userData.token;

      if (token) {
        localStorage.setItem('kisan_token', token);
      }
      
      localStorage.setItem('kisan_user', JSON.stringify(userData));
      setUser(userData);
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
      const token = data.token || data.accessToken || userObj.token;

      if (token) {
        localStorage.setItem('kisan_token', token);
      }
      
      localStorage.setItem('kisan_user', JSON.stringify(userObj));
      setUser(userObj);
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
    <AuthContext.Provider value={{ 
      user, login, register, logout, loading,
      isModalOpen, openAuthModal, closeAuthModal // 2. Export the modal controls
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);