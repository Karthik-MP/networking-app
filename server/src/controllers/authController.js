import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const signUpUser = async (req, res) => {
    const { email, password, locationUSA, locationIndia } = req.body;
    console.log(req.body);
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

export const loginUser = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in
            // console.log(userCredential);
            const user = userCredential.user;
            res.send({ success: true, message: 'Login successful.', uid: user.uid, token: user.accessToken });
        }
        )
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}