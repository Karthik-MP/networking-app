// context/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, getIdToken, signOut } from 'firebase/auth';
import { AppState } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Optional: Refresh token on app resume
  // useEffect(() => {
  //   const handleAppStateChange = async (nextAppState) => {
  //     if (nextAppState === 'active' && auth.currentUser) {
  //       try {
  //         await auth.currentUser.getIdToken(true); // Force refresh
  //         console.log('Token refreshed on app resume');
  //       } catch (e) {
  //         console.error('Error refreshing token on resume', e);
  //       }
  //     }
  //   };

  //   const subscription = AppState.addEventListener('change', handleAppStateChange);
  //   return () => subscription.remove();
  // }, []);

  // const login = async (userData) => {
  //   // Login is already handled by Firebase signInWithEmailAndPassword
  //   console.log('User logged in:', userData.email);
  //   // No need to setUser here — onAuthStateChanged handles it
  // };

  const logout = async () => {
    try {
      await signOut(auth);
      // setUser(null); // Will also be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getAccessToken = async () => {
    try {
      if (!auth.currentUser) return null;
      return await getIdToken(auth.currentUser, true); // Force refresh if expired
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
