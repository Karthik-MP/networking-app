import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function EventCard({ event, onPress }) {
  const eventDate = new Date(event.date).toLocaleDateString();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>Location: {event.location}</Text>
      <Text>Date: {eventDate}</Text>
      <Text>RSVPs: {event.rsvps?.length || 0}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: '#fff0f5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});
