import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const STORAGE_KEY = 'landlord_user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Landlord',
        phone: '+1234567890',
        currency: 'USD',
        createdAt: new Date(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const mockUser: User = {
        id: '1',
        email,
        name,
        currency: 'USD',
        createdAt: new Date(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to sign up' };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
}