import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
// import CompleteProfileScreen from '../screens/Profile/CompleteProfileScreen';

const Stack = createStackNavigator();

const ProfileStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={ProfileScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
);

export default ProfileStack;
