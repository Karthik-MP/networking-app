// import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import EventCard from '../components/EventCard';
// import { db } from '../services/firebase';

export default function EventsScreen() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            // const snapshot = await getDocs(collection(db, 'events'));
            // setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchEvents();
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return <FlatList data={events} renderItem={({ item }) => <EventCard event={item} />} />;
}
