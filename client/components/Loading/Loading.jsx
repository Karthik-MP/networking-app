import { ThemeContext } from '@contexts/ThemeContext'; // adjust path to your ThemeContext
import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Loading(props) {
  const { theme } = useContext(ThemeContext);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator
        size={props.size}
        color={theme.colors.primary}
      />
    </View>
  );
}
