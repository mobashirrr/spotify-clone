import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { PlaybackProvider } from '@/playback/PlaybackContext';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PlaybackProvider>
        <RootGate />
      </PlaybackProvider>
    </AuthProvider>
  );
}

function RootGate() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.brand}>Spotify</Text>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="album/[id]" />
      <Stack.Screen name="playlist/[id]" />
      <Stack.Screen
        name="now-playing"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  brand: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
