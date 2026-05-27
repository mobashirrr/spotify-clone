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
  isPlaying: boolean;
  isBuffering: boolean;
  play: (track: PlayableTrack) => void;
  toggle: () => void;
  stop: () => void;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [current, setCurrent] = useState<PlayableTrack | null>(null);

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

  const play = useCallback(
    (track: PlayableTrack) => {
      if (!track.audio) return;
      setCurrent((prev) => {
        if (prev?.id !== track.id) {
          player.replace({ uri: track.audio });
        }
        return track;
      });
      player.play();
    },
    [player],
  );

  const toggle = useCallback(() => {
    if (!current) return;
    if (status.playing) player.pause();
    else player.play();
  }, [player, status.playing, current]);

  const stop = useCallback(() => {
    player.pause();
    setCurrent(null);
  }, [player]);

  const value = useMemo<PlaybackContextValue>(
    () => ({
      current,
      isPlaying: status.playing,
      isBuffering: status.isBuffering,
      play,
      toggle,
      stop,
    }),
    [current, status.playing, status.isBuffering, play, toggle, stop],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback(): PlaybackContextValue {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error('usePlayback must be used inside <PlaybackProvider>');
  return ctx;
}
