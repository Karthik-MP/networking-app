// navigation/TabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import MentorshipScreen from '../screens/MentorshipScreen';
import { Ionicons } from '@expo/vector-icons';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Mentorship') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',

        // Header title style
        headerTitleStyle: {
          fontSize: 16, // smaller font
          fontWeight: 'bold',
        },

        headerStyle: {
          backgroundColor: '#f8f8f8',
          shadowColor: 'transparent', // remove shadow on iOS
          height: 90,
        },

        headerTitleAlign: 'center', // or 'left'

        // GLOBAL headerLeft with back button if canGoBack()
        headerLeft: () =>
          navigation.canGoBack() ? (
            <Ionicons
              name="chevron-back"
              size={24}
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ) : null,

      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Mentorship" component={MentorshipScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
