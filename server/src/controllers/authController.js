import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const signUpUser = async (req, res) => {
    const { email, password, locationUSA, locationIndia } = req.body;
    try {
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

        // Send success response
        res.send({ success: true, message: 'User created successfully.' });
    } catch (error) {
        // Handle any errors
        res.status(500).send({ error: error.message });
    }
};