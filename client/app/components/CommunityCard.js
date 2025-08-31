import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CommunityCard({ community, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{community.name}</Text>
            <Text>Type: {community.type}</Text>
            <Text>Members: {community.members?.length || 0}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        backgroundColor: '#e6f7ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});
