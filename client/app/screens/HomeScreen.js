import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const [communitiesCount, setCommunitiesCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [mentorshipCount, setMentorshipCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Count communities user has joined
                const communitiesSnapshot = await getDocs(collection(db, 'communities'));
                const joined = communitiesSnapshot.docs.filter(doc => doc.data().members.includes(user.uid));
                setCommunitiesCount(joined.length);

                // Count upcoming events
                const eventsSnapshot = await getDocs(collection(db, 'events'));
                const upcoming = eventsSnapshot.docs.filter(doc => new Date(doc.data().date) > new Date());
                setEventsCount(upcoming.length);

                // Count mentorship requests (mentee or mentor)
                const mentorshipSnapshot = await getDocs(collection(db, 'mentorshipRequests'));
                const related = mentorshipSnapshot.docs.filter(doc => {
                    const data = doc.data();
                    return data.menteeId === user.uid || data.mentorId === user.uid;
                });
                setMentorshipCount(related.length);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user.displayName || 'User'}!</Text>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{communitiesCount}</Text>
                    <Text>Communities Joined</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{eventsCount}</Text>
                    <Text>Upcoming Events</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{mentorshipCount}</Text>
                    <Text>Mentorship Connections</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Quick Links</Text>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Community')}>
                <Text style={styles.cardTitle}>Communities</Text>
                <Text>Connect with Indian & US state communities</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Mentorship')}>
                <Text style={styles.cardTitle}>Mentorship</Text>
                <Text>Find a mentor or become one</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Events')}>
                <Text style={styles.cardTitle}>Events</Text>
                <Text>Check out upcoming meetups</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.cardTitle}>Profile</Text>
                <Text>View or edit your profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    welcome: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
    summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    summaryCard: { flex: 1, margin: 5, padding: 15, backgroundColor: '#f1f1f1', borderRadius: 10, alignItems: 'center' },
    summaryTitle: { fontSize: 22, fontWeight: 'bold' },
    card: { padding: 20, backgroundColor: '#e2f0ff', borderRadius: 10, marginVertical: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});
