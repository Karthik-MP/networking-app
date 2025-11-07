// App.jsx
import AuthContext, { AuthProvider } from "@contexts/AuthContext";
import {
  ThemeProvider as AppThemeProvider,
  ThemeContext,
} from "@contexts/ThemeContext";
import { UserProfileProvider } from "@hooks/useUserProfile";
import AuthStack from "@navigations/AuthStack";
import TabNavigator from "@navigations/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppThemeProvider>
          <UserProfileProvider>
            <MainApp />
          </UserProfileProvider>
        </AppThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function MainApp() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <NavigationContainer theme={theme}>
        {/* <TabNavigator /> */}
        {user ? <TabNavigator /> : <AuthStack />}
      </NavigationContainer>

      <ToastManager
        iconSize={12}
        style={{
          position: "bottom",
          backgroundColor: "#4a4a4a",
          textColor: "#fff",
        }}
        textStyle={{ fontSize: 6 }}
      />
    </>
  );
}
