import { Image, StyleSheet, Text, View } from 'react-native';

export default function PostCard({ post }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{post.title}</Text>
            <Text>{post.description}</Text>
            {post.imageURL ? <Image source={{ uri: post.imageURL }} style={styles.image} /> : null}
            <Text style={styles.meta}>Posted by: {post.createdBy}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        backgroundColor: '#f0fff0',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1
    },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    image: { width: '100%', height: 150, marginTop: 10, borderRadius: 8 },
    meta: { marginTop: 5, fontSize: 12, color: '#555' }
});
