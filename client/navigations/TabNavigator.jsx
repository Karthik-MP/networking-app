import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Suspense, useCallback, useState } from "react";

import { APP_ROUTES } from "@constants/routes";

import Header from "@components/layout/Header";
import DashboardScreen from "@screens/DashboardScreen";
import MentorshipScreen from "@screens/MentorshipScreen";
import ProfileScreen from "@screens/ProfileScreen";
import CreateMenuSheet from "../components/CreateMenuSheet";
import { useTheme } from "../hooks/useTheme";
// import EventCreateScreen from "../screens/EventCreateScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const navigation = useNavigation();
  const { theme, dark } = useTheme(); 

  const [createOpen, setCreateOpen] = useState(false);

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);

  const handleCreateJobReferral = useCallback(() => {
    navigation.navigate("CreateJobRef", { screen: "JobReferralCreate" });
    closeCreate();
  }, [navigation, closeCreate]);

  const handleCreateEvent = useCallback(() => {
    navigation.navigate("CreateEvent", { screen: "EventCreate" });
    closeCreate();
  }, [navigation, closeCreate]);

  // header back button
  const defaultHeaderLeft = (nav) =>
    nav.canGoBack() ? (
      <Ionicons
        name="chevron-back"
        size={24}
        style={{ marginLeft: 15 }}
        color={theme.colors.text} // ✅ themed back icon
        onPress={nav.goBack}
      />
    ) : null;

  // tab icons
  const renderIcon = (focused, color, size, name) => (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={color}
    />
  );

  const activeTint = theme.colors.primary; // violet-600
  const inactiveTint = theme.colors.text + "80"; // same text color, 50% alpha

  return (
    <Suspense fallback={null}>
      <Tab.Navigator
        sceneContainerStyle={{
          backgroundColor: theme.colors.background, // ✅ themed scene bg
        }}
        screenOptions={{
          header: () => <Header onCreatePress={openCreate} />,
          tabBarStyle: {
            backgroundColor: theme.colors.card, // ✅ matches header card
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarActiveTintColor: activeTint,
          tabBarInactiveTintColor: inactiveTint,
        }}
      >
        <Tab.Screen
          name={APP_ROUTES.DASHBOARD}
          component={DashboardScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ focused, color, size }) =>
              renderIcon(focused, color, size, "home"),
            headerLeft: () => defaultHeaderLeft(navigation),
          })}
        />

        <Tab.Screen
          name={APP_ROUTES.JOBS}
          component={MentorshipScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ focused, color, size }) =>
              renderIcon(focused, color, size, "people"),
            headerLeft: () => defaultHeaderLeft(navigation),
          })}
        />

        <Tab.Screen
          name={APP_ROUTES.PROFILE}
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) =>
              renderIcon(focused, color, size, "person"),
          }}
        />
      </Tab.Navigator>

      <CreateMenuSheet
        visible={createOpen}
        onClose={closeCreate}
        onCreateJobReferral={handleCreateJobReferral}
        onCreateEvent={handleCreateEvent}
      />
    </Suspense>
  );
}
