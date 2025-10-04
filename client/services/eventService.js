import { db, storage } from './firebase';
import {
    addDoc, collection, serverTimestamp, Timestamp, doc, updateDoc, increment, getDoc, setDoc, query, where, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload local posters (JPEG only); return array of URLs
async function uploadPosters(eventId, postersLocal = []) {
    const urls = [];
    for (let i = 0; i < postersLocal.length; i++) {
        const { uri, fileName } = postersLocal[i];
        const resp = await fetch(uri);
        const blob = await resp.blob(); // size already validated in UI
        const path = `events/${eventId}/posters/${Date.now()}-${fileName || 'poster.jpg'}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
        const url = await getDownloadURL(storageRef);
        urls.push(url);
    }
    return urls;
}

/**
 * payload = {
 *  type, name,
 *  venue: { mode, location?, meetingLink? },
 *  timezone,
 *  eventAt: Date,
 *  description, hostName, guest,
 *  capacity: number,
 *  commentsEnabled: boolean,
 *  status: "active"
 * }
 */
export async function createEventWithUploads(payload, postersLocal, user) {
    const eventDoc = {
        type: payload.type,
        name: payload.name,

        venue: {
            mode: payload.venue.mode,
            location: payload.venue.location || null,
            meetingLink: payload.venue.meetingLink || null,
        },

        timezone: payload.timezone,
        eventAt: Timestamp.fromDate(new Date(payload.eventAt)),

        posters: [], // fill after upload
        description: payload.description,
        hostName: payload.hostName,
        guest: payload.guest || "",

        capacity: Number(payload.capacity),
        commentsEnabled: !!payload.commentsEnabled,

        createdBy: {
            uid: user?.uid ?? null,
            displayName: user?.displayName ?? null,
            email: user?.email ?? null,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: payload.status || "active",

        metrics: {
            registrations: 0,
            reactions: { like: 0, insightful: 0, interested: 0 },
            comments: 0,
        },

        // inviteCode reserved for later
        inviteCode: null,
    };

    // Create event first to get ID
    const ref = await addDoc(collection(db, 'events'), eventDoc);

    // Upload posters
    const posterUrls = await uploadPosters(ref.id, postersLocal);
    await updateDoc(ref, { posters: posterUrls, updatedAt: serverTimestamp() });

    return ref.id;
}

// Registration: one per user; block over capacity
export async function registerForEvent(eventId, user) {
    if (!user?.uid) throw new Error('Not authenticated');

    const regRef = doc(db, 'event_registrations', `${eventId}_${user.uid}`);
    const existing = await getDoc(regRef);
    if (existing.exists()) return; // already registered

    // Check capacity
    const ev = await getDoc(doc(db, 'events', eventId));
    if (!ev.exists()) throw new Error('Event not found');
    const data = ev.data();
    if (data.metrics?.registrations >= data.capacity) {
        throw new Error('Event is full');
    }

    await setDoc(regRef, {
        eventId,
        user: { uid: user.uid, displayName: user.displayName ?? null, email: user.email ?? null },
        createdAt: serverTimestamp(),
    });

    // increment count
    await updateDoc(doc(db, 'events', eventId), {
        'metrics.registrations': increment(1),
        updatedAt: serverTimestamp(),
    });
}

// Reactions: one reaction per user (can change)
export async function reactToEvent(eventId, user, type /* 'like'|'insightful'|'interested' */) {
    if (!user?.uid) throw new Error('Not authenticated');

    const myRef = doc(db, 'event_reactions', `${eventId}_${user.uid}`);
    const prev = await getDoc(myRef);
    let prevType = null;
    if (prev.exists()) {
        prevType = prev.data().type;
    }

    // If same type -> remove reaction
    if (prevType === type) {
        await setDoc(myRef, { eventId, user: { uid: user.uid }, type: null, createdAt: serverTimestamp() });
        if (prevType) {
            await updateDoc(doc(db, 'events', eventId), {
                [`metrics.reactions.${prevType}`]: increment(-1),
                updatedAt: serverTimestamp(),
            });
        }
        return;
    }

    // Change or set reaction
    await setDoc(myRef, { eventId, user: { uid: user.uid }, type, createdAt: serverTimestamp() });

    const updates = { updatedAt: serverTimestamp() };
    if (prevType) updates[`metrics.reactions.${prevType}`] = increment(-1);
    updates[`metrics.reactions.${type}`] = increment(1);

    await updateDoc(doc(db, 'events', eventId), updates);
}

// Basic feed: page by createdAt desc. For "load more" pass lastDoc snapshot.
export async function fetchEventsPage(limitCount = 10, lastSnap = null) {
    const { getDocs, orderBy, limit, startAfter } = await import('firebase/firestore'); // dynamic
    let q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(limitCount));
    if (lastSnap) q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), startAfter(lastSnap), limit(limitCount));
    const snap = await getDocs(q);
    return snap;
}
