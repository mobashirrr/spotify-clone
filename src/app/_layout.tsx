import { Stack } from 'expo-router';

import { PlaybackProvider } from '@/playback/PlaybackContext';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <PlaybackProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="playlist/[id]" />
        <Stack.Screen
          name="now-playing"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </PlaybackProvider>
  );
}
