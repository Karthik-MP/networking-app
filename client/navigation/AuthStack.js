// navigation/AuthStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';  // Welcome Screen (auth screen)
// import LoginScreen from '../screens/LoginScreen';  // Login Screen
import SignupScreen from '../screens/SignupScreen';  // Signup Screen

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}  // Hide the header for the Welcome screen
      />
      {/* You can apply the same to other screens if needed */}
      {/* <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
