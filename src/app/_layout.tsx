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
      />
    </PlaybackProvider>
  );
}
