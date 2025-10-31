// navigation/ChatStack.jsx
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../screens/ChatListScreen';
import ChatMessageScreen from '../screens/ChatMessageScreen';

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatMessage"
        component={ChatMessageScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Chat',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f8f8f8',
          },
        })}
      />
    </Stack.Navigator>
  );
}
