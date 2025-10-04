// navigation/CreateStack.tsx (or .jsx)
import { createStackNavigator } from '@react-navigation/stack';
import JobReferralCreateScreen from '../screens/JobReferralCreateScreen';
import EventCreateScreen from '../screens/EventCreateScreen'; // ← add this

const Stack = createStackNavigator();

export default function CreateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JobReferralCreate"
        component={JobReferralCreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventCreate"
        component={EventCreateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
