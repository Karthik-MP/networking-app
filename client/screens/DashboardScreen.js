import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Indian Networking</Text>
      <Text style={styles.subtitle}>Quick Links</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Communities')}>
        <Text style={styles.cardTitle}>Communities</Text>
        <Text>Connect by U.S. and Indian states</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Mentorship')}>
        <Text style={styles.cardTitle}>Mentorship</Text>
        <Text>Find a mentor or become one</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Events')}>
        <Text style={styles.cardTitle}>Events</Text>
        <Text>View upcoming meetups</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  card: { padding: 20, backgroundColor: '#f1f1f1', borderRadius: 10, marginVertical: 10 },
  cardTitle: { fontSize: 20, fontWeight: 'bold' }
});
