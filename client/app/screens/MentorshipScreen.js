import { useState } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import api from '../services/api';

export default function MentorshipScreen() {
    const [isMentor, setIsMentor] = useState(false);
    const [isMentee, setIsMentee] = useState(false);

    const updateRole = async () => {
        await api.post('/users/update', { mentor: isMentor, mentee: isMentee });
        alert('Updated mentorship status');
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text>Mentor: </Text>
            <Switch value={isMentor} onValueChange={setIsMentor} />

            <Text>Mentee: </Text>
            <Switch value={isMentee} onValueChange={setIsMentee} />

            <Button title="Save" onPress={updateRole} />
        </View>
    );
}
