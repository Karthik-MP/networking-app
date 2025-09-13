// context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from AsyncStorage on initial load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user'); // Get user from AsyncStorage
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Set user state if found
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage", error);
      }
    };

    loadUserData();
  }, []);

  const login = async (userData) => {
    console.log('Logging in user:', { uid: userData.uid, token: userData?.stsTokenManager?.accessToken, email: userData.email });
    setUser({ uid: userData.uid, token: userData?.stsTokenManager?.accessToken, email: userData.email });
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData)); // Save user to AsyncStorage
    } catch (error) {
      console.error("Error saving user data to AsyncStorage", error);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('user'); // Remove user from AsyncStorage
    } catch (error) {
      console.error("Error removing user data from AsyncStorage", error);
    }
  };

  const getIdToken = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      return parsedUser?.token || null;
    } catch (error) {
      console.error("Error getting token from AsyncStorage", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
