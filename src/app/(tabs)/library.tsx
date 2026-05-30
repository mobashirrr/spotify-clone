import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlbumArt } from '@/components/AlbumArt';
import { useAuth } from '@/auth/AuthContext';
import { useLibrary, type LibraryLikedTrack } from '@/library/LibraryContext';
import { usePlayback } from '@/playback/PlaybackContext';
import { PALETTES, colors, type PaletteName } from '@/theme/colors';

const PALETTE_KEYS = Object.keys(PALETTES) as PaletteName[];

function paletteFromId(id: string): PaletteName {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE_KEYS[Math.abs(h) % PALETTE_KEYS.length];
}

export default function Library() {
  const { user, signOut } = useAuth();
  const { loading, likedTracks, followedPlaylists } = useLibrary();
  const { playQueue } = usePlayback();

  const playLikedAt = (index: number) => {
    if (likedTracks.length === 0) return;
    const queue = likedTracks.map<LibraryLikedTrack>((t) => ({
      id: t.id,
      name: t.name,
      artist_name: t.artist_name,
      album_image: t.album_image,
      audio: t.audio,
    }));
    playQueue(queue, index);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity
          onPress={() => signOut()}
          hitSlop={8}
          activeOpacity={0.7}
          style={styles.signOutButton}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.text} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {user?.email ? (
        <Text style={styles.email}>Signed in as {user.email}</Text>
      ) : null}

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Liked songs</Text>
            {likedTracks.length === 0 ? (
              <Text style={styles.emptyHint}>
                Tap the heart on a song you're playing to save it here.
              </Text>
            ) : (
              likedTracks.map((t, i) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.trackRow}
                  activeOpacity={0.7}
                  onPress={() => playLikedAt(i)}
                >
                  {t.album_image ? (
                    <Image source={{ uri: t.album_image }} style={styles.trackArt} contentFit="cover" />
                  ) : (
                    <View style={[styles.trackArt, { backgroundColor: colors.surface }]} />
                  )}
                  <View style={styles.trackMeta}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {t.artist_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Playlists you follow</Text>
            {followedPlaylists.length === 0 ? (
              <Text style={styles.emptyHint}>
                Open a playlist and tap the heart to follow it.
              </Text>
            ) : (
              <View style={styles.grid}>
                {followedPlaylists.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.playlistCard}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({ pathname: '/playlist/[id]', params: { id: p.id } })
                    }
                  >
                    <AlbumArt
                      palette={paletteFromId(p.id)}
                      seed={`pl-${p.id}`}
                      size={112}
                      radius={12}
                    />
                    <Text style={styles.playlistTitle} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.playlistOwner} numberOfLines={1}>
                      by {p.user_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  email: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 12,
  },
  scroll: {
    flex: 1,
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: 13,
    paddingVertical: 12,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  trackArt: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  trackMeta: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackArtist: {
    color: colors.textMuted,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  playlistCard: {
    width: '47%',
    marginBottom: 8,
  },
  playlistTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  playlistOwner: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
