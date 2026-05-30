import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/auth/AuthContext';
import type { PlayableTrack } from '@/playback/PlaybackContext';
import { db } from '@/services/firebase';

export type LibraryLikedTrack = {
  id: string;
  name: string;
  artist_name: string;
  album_image?: string;
  audio: string;
};

export type LibraryFollowedPlaylist = {
  id: string;
  name: string;
  user_name: string;
};

type LibraryContextValue = {
  loading: boolean;
  likedTracks: LibraryLikedTrack[];
  followedPlaylists: LibraryFollowedPlaylist[];
  likedTrackIds: Set<string>;
  followedPlaylistIds: Set<string>;
  isTrackLiked: (id: string) => boolean;
  isPlaylistFollowed: (id: string) => boolean;
  toggleLike: (track: PlayableTrack) => Promise<void>;
  toggleFollow: (playlist: LibraryFollowedPlaylist) => Promise<void>;
};

const EMPTY_LIBRARY: LibraryContextValue = {
  loading: false,
  likedTracks: [],
  followedPlaylists: [],
  likedTrackIds: new Set(),
  followedPlaylistIds: new Set(),
  isTrackLiked: () => false,
  isPlaylistFollowed: () => false,
  toggleLike: async () => {},
  toggleFollow: async () => {},
};

const LibraryContext = createContext<LibraryContextValue>(EMPTY_LIBRARY);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [likedTracks, setLikedTracks] = useState<LibraryLikedTrack[]>([]);
  const [followedPlaylists, setFollowedPlaylists] = useState<LibraryFollowedPlaylist[]>([]);
  const [likedLoaded, setLikedLoaded] = useState(false);
  const [followedLoaded, setFollowedLoaded] = useState(false);

  useEffect(() => {
    if (!uid) {
      setLikedTracks([]);
      setFollowedPlaylists([]);
      setLikedLoaded(false);
      setFollowedLoaded(false);
      return;
    }

    setLikedLoaded(false);
    setFollowedLoaded(false);

    const likedRef = query(
      collection(db, 'users', uid, 'likedTracks'),
      orderBy('likedAt', 'desc'),
    );
    const followedRef = query(
      collection(db, 'users', uid, 'followedPlaylists'),
      orderBy('followedAt', 'desc'),
    );

    const unsubLiked = onSnapshot(likedRef, (snap) => {
      const items: LibraryLikedTrack[] = [];
      snap.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          name: data.name,
          artist_name: data.artist_name,
          album_image: data.album_image,
          audio: data.audio,
        });
      });
      setLikedTracks(items);
      setLikedLoaded(true);
    });

    const unsubFollowed = onSnapshot(followedRef, (snap) => {
      const items: LibraryFollowedPlaylist[] = [];
      snap.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          name: data.name,
          user_name: data.user_name,
        });
      });
      setFollowedPlaylists(items);
      setFollowedLoaded(true);
    });

    return () => {
      unsubLiked();
      unsubFollowed();
    };
  }, [uid]);

  const likedTrackIds = useMemo(
    () => new Set(likedTracks.map((t) => t.id)),
    [likedTracks],
  );
  const followedPlaylistIds = useMemo(
    () => new Set(followedPlaylists.map((p) => p.id)),
    [followedPlaylists],
  );

  const isTrackLiked = useCallback((id: string) => likedTrackIds.has(id), [likedTrackIds]);
  const isPlaylistFollowed = useCallback(
    (id: string) => followedPlaylistIds.has(id),
    [followedPlaylistIds],
  );

  const toggleLike = useCallback(
    async (track: PlayableTrack) => {
      if (!uid) return;
      const ref = doc(db, 'users', uid, 'likedTracks', track.id);
      if (likedTrackIds.has(track.id)) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          id: track.id,
          name: track.name,
          artist_name: track.artist_name,
          album_image: track.album_image ?? null,
          audio: track.audio,
          likedAt: serverTimestamp(),
        });
      }
    },
    [uid, likedTrackIds],
  );

  const toggleFollow = useCallback(
    async (playlist: LibraryFollowedPlaylist) => {
      if (!uid) return;
      const ref = doc(db, 'users', uid, 'followedPlaylists', playlist.id);
      if (followedPlaylistIds.has(playlist.id)) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          id: playlist.id,
          name: playlist.name,
          user_name: playlist.user_name,
          followedAt: serverTimestamp(),
        });
      }
    },
    [uid, followedPlaylistIds],
  );

  const value = useMemo<LibraryContextValue>(
    () => ({
      loading: uid ? !(likedLoaded && followedLoaded) : false,
      likedTracks,
      followedPlaylists,
      likedTrackIds,
      followedPlaylistIds,
      isTrackLiked,
      isPlaylistFollowed,
      toggleLike,
      toggleFollow,
    }),
    [
      uid,
      likedLoaded,
      followedLoaded,
      likedTracks,
      followedPlaylists,
      likedTrackIds,
      followedPlaylistIds,
      isTrackLiked,
      isPlaylistFollowed,
      toggleLike,
      toggleFollow,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  return useContext(LibraryContext);
}
