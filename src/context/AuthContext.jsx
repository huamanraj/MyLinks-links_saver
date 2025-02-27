import { createContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
      return false;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
