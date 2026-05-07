import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
    user: null,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          dispatch({ type: 'RESTORE_TOKEN', token, user: JSON.parse(userData) });
        }
      } catch (e) {
        console.error('Failed to restore token', e);
      } finally {
        dispatch({ type: 'RESTORE_DONE' });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      const accounts = [
        { 
          email: 'test@trackify.com', 
          password: 'test123456', 
          name: 'Bantolinao, Fritz John' 
        }
      ];

      const account = accounts.find(acc => acc.email === email && acc.password === password);
      
      if (!account) {
        throw new Error('Invalid credentials');
      }

      const token = 'fake-jwt-token-' + Date.now();
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(account));
      
      dispatch({ type: 'SIGN_IN', token, user: account });
    },

    signUp: async (name, email, password) => {
      const token = 'fake-jwt-token-' + Date.now();
      const user = { name, email, password };
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      dispatch({ type: 'SIGN_IN', token, user });
    },

    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch({ type: 'SIGN_OUT' });
    },

    state,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;