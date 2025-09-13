import { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AuthContext from '../context/AuthContext';
import { getRequest } from '../services/AuthServices';


export default function ProfileScreen() {
    // const [name, setName] = useState('');
    // const [profession, setProfession] = useState('');
    // const [nativeState, setNativeState] = useState('');
    const { user, logout } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        console.log('Fetched UID:', user);
        getProfile(user?.uid);
    }, []);

    const getProfile = async (uid) => {
        const config = {
            url: `users/${uid}`,
            token: `Bearer ${user?.token}`,
        };
        const response = await getRequest(config);
        setProfile(response?.data);
    };

    const handleLogout = async () => {
        await logout();
    }
    
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text>
                Hello Profile
            </Text>
            <View style={styles.container}>

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={profile?.email} editable={false} />

                <Text style={styles.label}>Location USA</Text>
                <TextInput
                    style={styles.input}
                    value={profile?.locationUSA}
                    editable={true} // Allow editing if needed
                    onChangeText={(text) => setUser({ ...profile, locationUSA: text })}
                />

                <Text style={styles.label}>Location India</Text>
                <TextInput
                    style={styles.input}
                    value={profile?.locationIndia}
                    editable={true}
                    onChangeText={(text) => setUser({ ...profile, locationIndia: text })}
                />

            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        padding: 20,
        marginTop: 40,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginTop: 5,
        backgroundColor: '#f9f9f9',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});