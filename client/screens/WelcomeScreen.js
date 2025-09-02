import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Indian Professionals Network</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Auth')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4CAF50' }]}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { width: 120, height: 120, marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
    button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, width: '80%', marginVertical: 10, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});
