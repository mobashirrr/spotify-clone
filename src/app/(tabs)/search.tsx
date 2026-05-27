import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlbumArt } from '@/components/AlbumArt';
import { usePlayback } from '@/playback/PlaybackContext';
import {
  searchAlbums,
  searchArtists,
  searchTracks,
  type JamendoAlbum,
  type JamendoArtist,
  type JamendoTrack,
} from '@/services/jamendo';
import { PALETTES, colors, type PaletteName } from '@/theme/colors';

const PALETTE_KEYS = Object.keys(PALETTES) as PaletteName[];
const RECENTS_KEY = 'spotify-clone:recent-searches';
const MAX_RECENTS = 6;
const DEBOUNCE_MS = 300;

function paletteFromId(id: string): PaletteName {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE_KEYS[Math.abs(h) % PALETTE_KEYS.length];
}

type Results = {
  tracks: JamendoTrack[];
  artists: JamendoArtist[];
  albums: JamendoAlbum[];
};

const EMPTY_RESULTS: Results = { tracks: [], artists: [], albums: [] };

export default function Search() {
  const { play } = usePlayback();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState<Results>(EMPTY_RESULTS);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(RECENTS_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecents(parsed.filter((x): x is string => typeof x === 'string'));
      } catch {
        // ignore corrupt storage
      }
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debounced) {
      setResults(EMPTY_RESULTS);
      setError(null);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setError(null);
    Promise.all([
      searchTracks(debounced, 10),
      searchArtists(debounced, 6),
      searchAlbums(debounced, 8),
    ]).then(
      ([tracks, artists, albums]) => {
        if (cancelled) return;
        setResults({ tracks, artists, albums });
        setSearching(false);
      },
      (e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setSearching(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const commitRecent = useCallback((value: string) => {
    const norm = value.trim();
    if (!norm) return;
    setRecents((prev) => {
      const next = [norm, ...prev.filter((r) => r.toLowerCase() !== norm.toLowerCase())].slice(0, MAX_RECENTS);
      AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    AsyncStorage.removeItem(RECENTS_KEY);
  }, []);

  const onRecentTap = (value: string) => {
    setQuery(value);
  };

  const onSubmitEditing = () => {
    if (debounced) commitRecent(debounced);
  };

  const hasResults =
    results.tracks.length > 0 || results.artists.length > 0 || results.albums.length > 0;
  const showEmptyState = debounced && !searching && !error && !hasResults;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSubmitEditing}
          placeholder="Artists, songs, or albums"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!debounced && recents.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent searches</Text>
              <TouchableOpacity onPress={clearRecents} hitSlop={8} activeOpacity={0.7}>
                <Text style={styles.linkText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {recents.map((r) => (
              <TouchableOpacity
                key={r}
                style={styles.recentRow}
                activeOpacity={0.7}
                onPress={() => onRecentTap(r)}
              >
                <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                <Text style={styles.recentText} numberOfLines={1}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {!debounced && recents.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyHint}>Search Jamendo for tracks, artists, and albums.</Text>
          </View>
        ) : null}

        {searching ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}

        {error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorTitle}>Couldn't search</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : null}

        {showEmptyState ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyHint}>No results for "{debounced}".</Text>
          </View>
        ) : null}

        {!searching && !error && hasResults ? (
          <>
            {results.tracks.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Songs</Text>
                {results.tracks.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.trackRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      commitRecent(debounced);
                      play({
                        id: t.id,
                        name: t.name,
                        artist_name: t.artist_name,
                        album_image: t.album_image,
                        audio: t.audio,
                      });
                    }}
                  >
                    <AlbumArt
                      palette={paletteFromId(t.id)}
                      seed={`t-${t.id}`}
                      size={48}
                      radius={8}
                      imageUrl={t.album_image}
                    />
                    <View style={styles.trackMeta}>
                      <Text style={styles.trackTitle} numberOfLines={1}>
                        {t.name}
                      </Text>
                      <Text style={styles.trackSubtitle} numberOfLines={1}>
                        Song · {t.artist_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {results.artists.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Artists</Text>
                <View style={styles.grid}>
                  {results.artists.map((a) => (
                    <TouchableOpacity
                      key={a.id}
                      style={styles.artistCard}
                      activeOpacity={0.7}
                      onPress={() => commitRecent(debounced)}
                    >
                      <AlbumArt
                        palette={paletteFromId(a.id)}
                        seed={`ar-${a.id}`}
                        size={92}
                        radius={46}
                        imageUrl={a.image}
                      />
                      <Text style={styles.artistName} numberOfLines={1}>
                        {a.name}
                      </Text>
                      <Text style={styles.artistKind}>Artist</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

            {results.albums.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Albums</Text>
                <View style={styles.grid}>
                  {results.albums.map((al) => (
                    <TouchableOpacity
                      key={al.id}
                      style={styles.albumCard}
                      activeOpacity={0.7}
                      onPress={() => {
                        commitRecent(debounced);
                        router.push({ pathname: '/album/[id]', params: { id: al.id } });
                      }}
                    >
                      <AlbumArt
                        palette={paletteFromId(al.id)}
                        seed={`al-${al.id}`}
                        size={112}
                        radius={14}
                        imageUrl={al.image}
                      />
                      <Text style={styles.albumTitle} numberOfLines={1}>
                        {al.name}
                      </Text>
                      <Text style={styles.albumArtist} numberOfLines={1}>
                        {al.artist_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 8,
    marginBottom: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    padding: 0,
  },
  scroll: {
    flex: 1,
    marginTop: 18,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  linkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  recentText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  trackMeta: {
    flex: 1,
  },
  trackTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  artistCard: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  artistName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  artistKind: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  albumCard: {
    width: '47%',
    marginBottom: 8,
  },
  albumTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  albumArtist: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  centerState: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 8,
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
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
    paddingHorizontal: 16,
  },
});
