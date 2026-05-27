import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { usePlayback } from '@/playback/PlaybackContext';
import { colors } from '@/theme/colors';

export function MiniPlayer() {
  const { current, isPlaying, isBuffering, toggle } = usePlayback();

  if (!current) return null;

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.85}
        onPress={() => router.push('/now-playing')}
      >
        {current.album_image ? (
          <Image source={{ uri: current.album_image }} style={styles.art} contentFit="cover" />
        ) : (
          <View style={[styles.art, styles.artFallback]} />
        )}
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {current.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {current.artist_name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggle}
          hitSlop={12}
          activeOpacity={0.7}
          style={styles.playButton}
        >
          <Ionicons
            name={isBuffering ? 'sync' : isPlaying ? 'pause' : 'play'}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 8,
    marginBottom: 6,
    borderRadius: 10,
    backgroundColor: colors.surfaceTint,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 10,
  },
  art: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  artFallback: {
    backgroundColor: colors.primary,
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  artist: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
