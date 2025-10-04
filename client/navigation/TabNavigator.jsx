// navigation/TabNavigator.tsx (or .jsx)

import { useCallback, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import MentorshipScreen from '../screens/MentorshipScreen';
import ProfileStack from './ProfileStack';
import CreateStack from './CreateStack';
import CreateMenuSheet from '../components/CreateMenuSheet';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const navigation = useNavigation();
  const [createOpen, setCreateOpen] = useState(false);

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);

  const onCreateJobReferral = useCallback(() => {
    navigation.navigate('Create', { screen: 'JobReferralCreate' });
    closeCreate();
  }, [navigation, closeCreate]);

  const onCreateEvent = useCallback(() => {
    navigation.navigate('Create', { screen: 'EventCreate' });
    closeCreate();
  }, [navigation, closeCreate]);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerTitleStyle: { fontSize: 16, fontWeight: 'bold' },
          headerStyle: {
            backgroundColor: '#f8f8f8',
            shadowColor: 'transparent',
            height: 90,
          },
          headerTitleAlign: 'center',
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
            headerLeft: () =>
              navigation.canGoBack() ? (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  style={{ marginLeft: 15 }}
                  onPress={navigation.goBack}
                />
              ) : null,
          })}
        />

        <Tab.Screen
          name="Events"
          component={EventsScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={size}
                color={color}
              />
            ),
            headerLeft: () =>
              navigation.canGoBack() ? (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  style={{ marginLeft: 15 }}
                  onPress={navigation.goBack}
                />
              ) : null,
          })}
        />

        {/* <Tab.Screen
          name="Create"
          component={CreateStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Create',
            tabBarButton: ({ accessibilityLabel = 'Create', disabled = false }) => (
              <Pressable
                onPress={openCreate}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                className="items-center justify-center"
                style={{ bottom: -10 }}
              >
                <View className="w-16 h-16 rounded-full items-center justify-center shadow-lg">
                  <Ionicons name="add-circle" size={32} />
                  <Text>Create</Text>
                </View>
              </Pressable>
            ),
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
          }}
        /> */}

        <Tab.Screen
          name="Create"
          component={CreateStack}
          options={({ navigation }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size, accessibilityLabel = 'Create', disabled = false }) => (
              <Pressable
                onPress={openCreate}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                className="items-center justify-center"
                style={{ bottom: -1 }}
              >
                <Ionicons
                  name={focused ? 'add-circle' : 'add-circle-outline'}
                  size={size}
                  color={color}
                />
              </Pressable>
            ),
            headerLeft: () =>
              navigation.canGoBack() ? (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  style={{ marginLeft: 15 }}
                  onPress={navigation.goBack}
                />
              ) : null,
          })}
        />
        <Tab.Screen
          name="Mentorship"
          component={MentorshipScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={size}
                color={color}
              />
            ),
            headerLeft: () =>
              navigation.canGoBack() ? (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  style={{ marginLeft: 15 }}
                  onPress={navigation.goBack}
                />
              ) : null,
          })}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={({ navigation }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            ),
          })}
        />
      </Tab.Navigator>


      <CreateMenuSheet
        visible={createOpen}
        onClose={closeCreate}
        onCreateJobReferral={onCreateJobReferral}
        onCreateEvent={onCreateEvent}
      />
    </>
  );
}
