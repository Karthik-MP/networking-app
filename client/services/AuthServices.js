import axios from 'axios';
import { auth, db } from './firebase.js';
import Constants from 'expo-constants';

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_SERVER_BASE_URL

export const login = async (data) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save extra user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    locationUSA,
    locationIndia,
    createdAt: serverTimestamp(),
  });
}


export const getRequest = async (config) => {
  console.log(`GET Request to ${config?.url}`);

  try {
    const response = await axios.get(`${SERVER_BASE_URL}${config?.url}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: config?.token,
      }
    }); // ✅ uses interceptor
    return response;
  } catch (error) {
    console.error('Error in getRequest:', error);
    throw error;
  }
};
