// import { admin } from '../services/firebase-admin';

// const db = admin.firestore();

// export const updateUserProfile = async (req, res) => {
//     const { uid, name, profession, location, nativeState, mentor, mentee } = req.body;
//     try {
//         await db.collection('users').doc(uid).set({
//             name, profession, location, nativeState, mentor, mentee
//         }, { merge: true });
//         res.send({ success: true });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };

// export const getUserProfile = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const doc = await db.collection('users').doc(id).get();
//         if (!doc.exists) return res.status(404).send('User not found');
//         res.send(doc.data());
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
