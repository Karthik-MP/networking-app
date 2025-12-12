// App.jsx
import AuthContext, { AuthProvider } from "@contexts/AuthContext";
import {
  ThemeProvider as AppThemeProvider,
  ThemeContext,
} from "@contexts/ThemeContext";
import { UserProfileProvider } from "@hooks/useUserProfile";
import AuthStack from "@navigations/AuthStack";
import CreateStack from "@navigations/CreateStack";
import TabNavigator from "@navigations/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/toast";
import "./global.css";

const RootStack = createStackNavigator();

export default function App() {
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppThemeProvider>
            <UserProfileProvider>
              <MainApp />
            </UserProfileProvider>
          </AppThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function MainApp() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <NavigationContainer theme={theme}>
        {user ? (
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Main" component={TabNavigator} />
            <RootStack.Screen name="CreateStack" component={CreateStack} />
          </RootStack.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
      <Toast config={toastConfig} topOffset={60} bottomOffset={60} />
    </>
  );
}
