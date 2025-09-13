import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Admin SDK (important for server-side token verification)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault() // or provide a specific service account JSON
// });

export { auth, db, app };
