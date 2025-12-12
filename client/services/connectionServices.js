
import { arrayRemove, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function addConnections(currentUserUid, followerUid) {
    try {
        if (!currentUserUid || !followerUid) {
            throw new Error("Both user UID and follower UID are required.");
        }

        // Reference to the connection document using the current user UID
        const connectionDocRef = doc(db, 'connections', currentUserUid);

        // Check if the document already exists
        const docSnapshot = await getDoc(connectionDocRef);

        if (docSnapshot.exists()) {
            // If document exists, append to the requested_followers_id array
            await updateDoc(connectionDocRef, {
                requested_followers_id: arrayUnion(followerUid), // Append to array without duplicates
                updatedAt: serverTimestamp(), // Update timestamp
            });
            console.log("Follower request added successfully.");
        } else {
            // If document does not exist, create a new one
            await setDoc(connectionDocRef, {
                uid: currentUserUid,
                follower_id: [],
                requested_followers_id: [followerUid], // Initialize with first follower
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            console.log("Document created with follower request.");
        }

        return currentUserUid; // Return the user UID as a reference to the document created/updated
    } catch (error) {
        console.error("Error in addConnections:", error);
        throw error; // Rethrow the error for further handling
    }
}

export async function removeConnection(currentUserUid, followerUid) {
    try {
        if (!currentUserUid || !followerUid) {
            throw new Error("Both user UID and follower UID are required.");
        }

        // Reference to the connection document using the current user UID
        const connectionDocRef = doc(db, 'connections', currentUserUid);

        // Remove from requested_followers_id array
        await updateDoc(connectionDocRef, {
            requested_followers_id: arrayRemove(followerUid), // Remove from array
            updatedAt: serverTimestamp(), // Update timestamp
        });

        console.log("Connection request removed successfully.");
        return currentUserUid;
    } catch (error) {
        console.error("Error in removeConnection:", error);
        throw error; // Rethrow the error for further handling
    }
}
