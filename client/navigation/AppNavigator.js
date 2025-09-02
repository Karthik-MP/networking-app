// navigation/AppNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
// import EventsScreen from '../screens/EventsScreen';
// import MentorshipScreen from '../screens/MentorshipScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      {/* <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Mentorship" component={MentorshipScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

export default AppNavigator;
