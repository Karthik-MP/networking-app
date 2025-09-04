import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import api from '../services/api';

export default function ProfileScreen() {
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('');
    const [nativeState, setNativeState] = useState('');

    const saveProfile = async () => {
        await api.post('/users/update', { name, profession, nativeState });
        alert('Profile Updated');
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <TextInput placeholder="Profession" value={profession} onChangeText={setProfession} />
            <TextInput placeholder="Native State" value={nativeState} onChangeText={setNativeState} />
            <Button title="Save" onPress={saveProfile} />
        </View>
    );
}
