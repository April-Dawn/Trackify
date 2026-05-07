import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../services/DatabaseService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { restoreSession(); }, []);

  const restoreSession = async () => {
    try {
      const session = await db.getSession();
      if (session?.userId) {
        const u = await db.getUserById(session.userId);
        if (u) setUser(u);
      }
    } catch (e) {}
    setLoading(false);
  };

  const login = async (email, password) => {
    const result = await db.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = async (name, email, password) => {
    const result = await db.register(name, email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = async () => {
    await db.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (user) {
      const updated = await db.getUserById(user.id);
      if (updated) setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);