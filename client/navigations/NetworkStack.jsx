// navigation/NetworkStack.jsx
import { createStackNavigator } from "@react-navigation/stack";
import MyNetwork from "@screens/MyNetwork";
import ProfileScreen from "@screens/ProfileScreen";

const Stack = createStackNavigator();

export default function NetworkStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyNetworkList"
        component={MyNetwork}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
