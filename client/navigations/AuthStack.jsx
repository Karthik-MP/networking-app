// navigation/AuthStack.js
import { AUTH_ROUTES } from "@constants/routes";
import { createStackNavigator } from "@react-navigation/stack";
import { Suspense, lazy } from "react";

const WelcomeScreen = lazy(() => import("../screens/WelcomeScreen"));
const SignupScreen = lazy(() => import("../screens/SignupScreen"));

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Suspense fallback={null}>
      <Stack.Navigator
        initialRouteName={AUTH_ROUTES.WELCOME}
        screenOptions={{
          headerShown: false,
          animation: "fade",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name={AUTH_ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={AUTH_ROUTES.SIGNUP} component={SignupScreen} />
      </Stack.Navigator>
    </Suspense>
  );
}
