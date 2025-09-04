import { useContext } from "react";
import { AuthProvider } from "./context/AuthContext"; // Import your Auth context
import AuthStack from "./navigation/AuthStack"; // Your auth flow stack (Welcome, Login, etc.)
import AppNavigator from "./navigation/AppNavigator"; // Your tab navigation stack
import AuthContext from "./context/AuthContext"; // Import your AuthContext
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user } = useContext(AuthContext); // Now `user` will be defined after AuthProvider is loaded
  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
