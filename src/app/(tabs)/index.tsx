import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlbumArt } from '@/components/AlbumArt';
import type { HomeCard, Shelf } from '@/data/home';
import {
  getNewTracks,
  getPopularAlbums,
  getPopularTracks,
  getRecentPlaylists,
} from '@/services/jamendo';
import { PALETTES, colors, type PaletteName } from '@/theme/colors';

const PALETTE_KEYS = Object.keys(PALETTES) as PaletteName[];

function paletteFromId(id: string): PaletteName {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE_KEYS[Math.abs(h) % PALETTE_KEYS.length];
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

type HomeData = {
  quickPlay: HomeCard[];
  shelves: Shelf[];
};

async function loadHome(): Promise<HomeData> {
  const [tracks, albums, newTracks, playlists] = await Promise.all([
    getPopularTracks(8),
    getPopularAlbums(8),
    getNewTracks(8),
    getRecentPlaylists(6),
  ]);

  return {
    quickPlay: playlists.map((pl) => ({
      id: `pl-${pl.id}`,
      kind: 'playlist' as const,
      targetId: pl.id,
      title: pl.name,
      palette: paletteFromId(pl.id),
    })),
    shelves: [
      {
        id: 'popular-tracks',
        title: 'Popular tracks',
        items: tracks.map((t) => ({
          id: `t-${t.id}`,
          kind: 'track' as const,
          targetId: t.id,
          title: t.name,
          subtitle: t.artist_name,
          imageUrl: t.album_image,
          palette: paletteFromId(t.id),
        })),
      },
      {
        id: 'popular-albums',
        title: 'Popular albums',
        items: albums.map((a) => ({
          id: `a-${a.id}`,
          kind: 'album' as const,
          targetId: a.id,
          title: a.name,
          subtitle: a.artist_name,
          imageUrl: a.image,
          palette: paletteFromId(a.id),
        })),
      },
      {
        id: 'new-releases',
        title: 'New releases',
        items: newTracks.map((t) => ({
          id: `n-${t.id}`,
          kind: 'track' as const,
          targetId: t.id,
          title: t.name,
          subtitle: t.artist_name,
          imageUrl: t.album_image,
          palette: paletteFromId(t.id),
        })),
      },
    ],
  };
}

function openCard(item: HomeCard) {
  if (item.kind === 'album') {
    router.push({ pathname: '/album/[id]', params: { id: item.targetId } });
  } else if (item.kind === 'playlist') {
    router.push({ pathname: '/playlist/[id]', params: { id: item.targetId } });
  }
}

function QuickPlayCard({ item }: { item: HomeCard }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.quickCard} onPress={() => openCard(item)}>
      <AlbumArt palette={item.palette} seed={item.id} size={56} radius={12} imageUrl={item.imageUrl} />
      <Text style={styles.quickTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

function ShelfCard({ item }: { item: HomeCard }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.shelfCard} onPress={() => openCard(item)}>
      <AlbumArt palette={item.palette} seed={item.id} size={148} radius={20} imageUrl={item.imageUrl} />
      <Text style={styles.shelfCardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.subtitle ? (
        <Text style={styles.shelfCardSubtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

function ShelfRow({ shelf }: { shelf: Shelf }) {
  return (
    <View style={styles.shelf}>
      <Text style={styles.shelfTitle}>{shelf.title}</Text>
      <FlatList
        data={shelf.items}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shelfList}
        renderItem={({ item }) => <ShelfCard item={item} />}
      />
    </View>
  );
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);
    loadHome().then(
      (d) => {
        if (!cancelled) setData(d);
      },
      (e: unknown) => {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          setError(msg);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{greeting()}</Text>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </View>

        {!data && !error ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.centerHint}>Loading from Jamendo…</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorTitle}>Couldn't load music</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retry} activeOpacity={0.7}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {data ? (
          <>
            <View style={styles.quickGrid}>
              {data.quickPlay.map((item) => (
                <QuickPlayCard key={item.id} item={item} />
              ))}
            </View>

            {data.shelves.map((shelf) => (
              <ShelfRow key={shelf.id} shelf={shelf} />
            ))}
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
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  centerState: {
    paddingHorizontal: 20,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  centerHint: {
    color: colors.textMuted,
    fontSize: 13,
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
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  quickCard: {
    width: '47%',
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginBottom: 10,
    marginHorizontal: 4,
    flexBasis: '47%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
    marginRight: 6,
  },
  shelf: {
    marginBottom: 28,
  },
  shelfTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  shelfList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  shelfCard: {
    width: 148,
  },
  shelfCardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
  },
  shelfCardSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
