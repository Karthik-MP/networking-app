import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { auth } from '../services/firebase';

export default function AuthScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Dashboard');
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Login" onPress={login} />
        </View>
    );
}
