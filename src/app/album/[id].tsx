import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { getAlbumDetail, type JamendoAlbumDetail } from '@/services/jamendo';
import { PALETTES, colors, type PaletteName } from '@/theme/colors';

const PALETTE_KEYS = Object.keys(PALETTES) as PaletteName[];

function paletteFromId(id: string): PaletteName {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE_KEYS[Math.abs(h) % PALETTE_KEYS.length];
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function releaseYear(date?: string): string | null {
  if (!date) return null;
  const y = date.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : null;
}

export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [album, setAlbum] = useState<JamendoAlbumDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setError(null);
    setAlbum(null);
    getAlbumDetail(id).then(
      (d) => {
        if (cancelled) return;
        if (!d) setError('Album not found.');
        else setAlbum(d);
      },
      (e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);
  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  }, []);

  const palette = album ? PALETTES[paletteFromId(album.id)] : PALETTES.lavender;
  const year = releaseYear(album?.releasedate);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[palette.b, colors.background]}
        locations={[0, 0.55]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} hitSlop={10} activeOpacity={0.7} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        {!album && !error ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}

        {error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorTitle}>Couldn't load album</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retry} activeOpacity={0.7}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {album ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <AlbumArt
                palette={paletteFromId(album.id)}
                seed={`a-${album.id}`}
                size={220}
                radius={12}
                imageUrl={album.image}
              />
            </View>

            <Text style={styles.albumName} numberOfLines={2}>
              {album.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {album.artist_name}
            </Text>
            <Text style={styles.meta}>
              Album{year ? ` · ${year}` : ''} · {album.tracks.length} song
              {album.tracks.length === 1 ? '' : 's'}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity activeOpacity={0.7} hitSlop={8} style={styles.iconAction}>
                <Ionicons name="heart-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity activeOpacity={0.85} style={styles.playButton}>
                <Ionicons name="play" size={26} color={colors.background} />
              </TouchableOpacity>
            </View>

            <View style={styles.trackList}>
              {album.tracks.map((t, i) => (
                <TouchableOpacity key={t.id} style={styles.trackRow} activeOpacity={0.7}>
                  <Text style={styles.trackIndex}>{t.position ?? i + 1}</Text>
                  <View style={styles.trackMeta}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {album.artist_name}
                    </Text>
                  </View>
                  <Text style={styles.trackDuration}>{formatDuration(t.duration)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  albumName: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    paddingHorizontal: 20,
  },
  artistName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  iconAction: {
    padding: 4,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackList: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 14,
  },
  trackIndex: {
    width: 24,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  trackMeta: {
    flex: 1,
  },
  trackTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  trackArtist: {
    color: colors.textMuted,
    fontSize: 12,
  },
  trackDuration: {
    color: colors.textMuted,
    fontSize: 12,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  errorMessage: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  retryText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
