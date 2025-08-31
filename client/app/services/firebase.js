import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAlfBYCjXDhBv0T_HfR0wUuRiE9UE1A-7o",
  authDomain: "networking-app-ca9d6.firebaseapp.com",
  projectId: "networking-app-ca9d6",
  storageBucket: "networking-app-ca9d6.firebasestorage.app",
  messagingSenderId: "223754463309",
  appId: "1:223754463309:web:99678212f6bcabf0d7d404",
  measurementId: "G-L2BLS1DEE7"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);

export default { auth, provider, db };