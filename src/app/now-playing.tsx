import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLibrary } from '@/library/LibraryContext';
import { usePlayback } from '@/playback/PlaybackContext';
import { PALETTES, colors, type PaletteName } from '@/theme/colors';

const PALETTE_KEYS = Object.keys(PALETTES) as PaletteName[];

function paletteFromId(id: string): PaletteName {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE_KEYS[Math.abs(h) % PALETTE_KEYS.length];
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function NowPlaying() {
  const {
    current,
    queue,
    currentIndex,
    isPlaying,
    isBuffering,
    position,
    duration,
    hasNext,
    hasPrevious,
    toggle,
    next,
    previous,
    seekTo,
    seekBy,
  } = usePlayback();
  const { isTrackLiked, toggleLike } = useLibrary();

  const [dragValue, setDragValue] = useState<number | null>(null);

  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, []);

  useEffect(() => {
    if (!current) close();
  }, [current, close]);

  if (!current) return null;

  const palette = PALETTES[paletteFromId(current.id)];
  const sliderValue = dragValue ?? position;
  const upNext = queue.slice(currentIndex + 1);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[palette.b, colors.background]}
        locations={[0, 0.6]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={close} hitSlop={10} activeOpacity={0.7} style={styles.iconButton}>
            <Ionicons name="chevron-down" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.topTitle} numberOfLines={1}>
            {current.artist_name}
          </Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroWrap}>
            {current.album_image ? (
              <Image source={{ uri: current.album_image }} style={styles.hero} contentFit="cover" />
            ) : (
              <View style={[styles.hero, { backgroundColor: palette.a }]} />
            )}
          </View>

          <View style={styles.meta}>
            <View style={styles.metaText}>
              <Text style={styles.trackName} numberOfLines={2}>
                {current.name}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {current.artist_name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleLike(current)}
              hitSlop={10}
              activeOpacity={0.7}
              style={styles.likeButton}
            >
              <Ionicons
                name={isTrackLiked(current.id) ? 'heart' : 'heart-outline'}
                size={26}
                color={isTrackLiked(current.id) ? colors.primary : colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.seekRow}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={Math.max(duration, 1)}
              value={sliderValue}
              onValueChange={(v) => setDragValue(v)}
              onSlidingComplete={(v) => {
                seekTo(v);
                setDragValue(null);
              }}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.text}
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(sliderValue)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.transport}>
            <TouchableOpacity onPress={() => seekBy(-10)} hitSlop={10} activeOpacity={0.7}>
              <MaterialCommunityIcons name="rewind-10" size={32} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={previous} hitSlop={10} activeOpacity={0.7} disabled={!hasPrevious}>
              <Ionicons
                name="play-skip-back"
                size={30}
                color={hasPrevious ? colors.text : colors.tabBarInactive}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggle}
              hitSlop={12}
              activeOpacity={0.85}
              style={styles.playBtn}
            >
              <Ionicons
                name={isBuffering ? 'sync' : isPlaying ? 'pause' : 'play'}
                size={32}
                color={colors.background}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={next} hitSlop={10} activeOpacity={0.7} disabled={!hasNext}>
              <Ionicons
                name="play-skip-forward"
                size={30}
                color={hasNext ? colors.text : colors.tabBarInactive}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seekBy(10)} hitSlop={10} activeOpacity={0.7}>
              <MaterialCommunityIcons name="fast-forward-10" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>

          {upNext.length > 0 ? (
            <View style={styles.upNext}>
              <Text style={styles.upNextTitle}>Up next</Text>
              {upNext.map((t) => (
                <View key={t.id} style={styles.upNextRow}>
                  {t.album_image ? (
                    <Image source={{ uri: t.album_image }} style={styles.upNextArt} contentFit="cover" />
                  ) : (
                    <View style={[styles.upNextArt, { backgroundColor: colors.surface }]} />
                  )}
                  <View style={styles.upNextMeta}>
                    <Text style={styles.upNextName} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={styles.upNextArtist} numberOfLines={1}>
                      {t.artist_name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  heroWrap: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 28,
  },
  hero: {
    width: 300,
    height: 300,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 22,
    gap: 12,
  },
  metaText: {
    flex: 1,
    minWidth: 0,
  },
  likeButton: {
    padding: 4,
  },
  trackName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  artist: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 6,
  },
  seekRow: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -4,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 28,
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upNext: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  upNextTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  upNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  upNextArt: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
  upNextMeta: {
    flex: 1,
  },
  upNextName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  upNextArtist: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
