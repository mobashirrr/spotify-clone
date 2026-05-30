import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type PlayableTrack = {
  id: string;
  name: string;
  artist_name: string;
  album_image?: string;
  audio: string;
};

type PlaybackContextValue = {
  current: PlayableTrack | null;
  queue: PlayableTrack[];
  currentIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (track: PlayableTrack) => void;
  playQueue: (tracks: PlayableTrack[], startIndex?: number) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  seekBy: (deltaSeconds: number) => void;
  stop: () => void;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

const PREV_RESTART_THRESHOLD_SECONDS = 3;

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const [queue, setQueue] = useState<PlayableTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lastFinishedIndexRef = useRef(-1);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
      allowsRecording: false,
      shouldRouteThroughEarpiece: false,
    }).catch(() => {
      // Best-effort: playback still works without the preferred mode.
    });
  }, []);

  const loadAndPlayAt = useCallback(
    (tracks: PlayableTrack[], index: number) => {
      const track = tracks[index];
      if (!track?.audio) return;
      lastFinishedIndexRef.current = -1;
      player.replace({ uri: track.audio });
      player.play();
    },
    [player],
  );

  const playQueue = useCallback(
    (tracks: PlayableTrack[], startIndex = 0) => {
      if (tracks.length === 0) return;
      const safeIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));
      setQueue(tracks);
      setCurrentIndex(safeIndex);
      loadAndPlayAt(tracks, safeIndex);
    },
    [loadAndPlayAt],
  );

  const play = useCallback(
    (track: PlayableTrack) => {
      playQueue([track], 0);
    },
    [playQueue],
  );

  const toggle = useCallback(() => {
    if (currentIndex < 0) return;
    if (status.playing) player.pause();
    else player.play();
  }, [player, status.playing, currentIndex]);

  const next = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= queue.length - 1) return;
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    loadAndPlayAt(queue, nextIndex);
  }, [queue, currentIndex, loadAndPlayAt]);

  const previous = useCallback(() => {
    if (currentIndex < 0) return;
    if (status.currentTime > PREV_RESTART_THRESHOLD_SECONDS) {
      player.seekTo(0).catch(() => {});
      return;
    }
    if (currentIndex === 0) {
      player.seekTo(0).catch(() => {});
      return;
    }
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    loadAndPlayAt(queue, prevIndex);
  }, [player, queue, currentIndex, status.currentTime, loadAndPlayAt]);

  const seekTo = useCallback(
    (seconds: number) => {
      player.seekTo(seconds).catch(() => {});
    },
    [player],
  );

  const seekBy = useCallback(
    (deltaSeconds: number) => {
      if (currentIndex < 0) return;
      const max = status.duration > 0 ? status.duration : Number.POSITIVE_INFINITY;
      const target = Math.max(0, Math.min(status.currentTime + deltaSeconds, max));
      player.seekTo(target).catch(() => {});
    },
    [player, currentIndex, status.currentTime, status.duration],
  );

  const stop = useCallback(() => {
    player.pause();
    setQueue([]);
    setCurrentIndex(-1);
    lastFinishedIndexRef.current = -1;
  }, [player]);

  useEffect(() => {
    if (!status.didJustFinish) return;
    if (lastFinishedIndexRef.current === currentIndex) return;
    lastFinishedIndexRef.current = currentIndex;
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      loadAndPlayAt(queue, nextIndex);
    }
  }, [status.didJustFinish, currentIndex, queue, loadAndPlayAt]);

  const current = currentIndex >= 0 ? queue[currentIndex] ?? null : null;
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1;
  const hasPrevious = currentIndex > 0;

  const value = useMemo<PlaybackContextValue>(
    () => ({
      current,
      queue,
      currentIndex,
      isPlaying: status.playing,
      isBuffering: status.isBuffering,
      position: status.currentTime,
      duration: status.duration,
      hasNext,
      hasPrevious,
      play,
      playQueue,
      toggle,
      next,
      previous,
      seekTo,
      seekBy,
      stop,
    }),
    [
      current,
      queue,
      currentIndex,
      status.playing,
      status.isBuffering,
      status.currentTime,
      status.duration,
      hasNext,
      hasPrevious,
      play,
      playQueue,
      toggle,
      next,
      previous,
      seekTo,
      seekBy,
      stop,
    ],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback(): PlaybackContextValue {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error('usePlayback must be used inside <PlaybackProvider>');
  return ctx;
}
