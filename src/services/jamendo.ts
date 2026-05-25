const BASE_URL = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

export type JamendoAlbum = {
  id: string;
  name: string;
  artist_name: string;
  image: string;
  releasedate: string;
};

export type JamendoTrack = {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  duration: number;
};

export type JamendoPlaylist = {
  id: string;
  name: string;
  user_name: string;
  creationdate: string;
};

type JamendoResponse<T> = {
  headers: {
    status: string;
    code: number;
    error_message?: string;
  };
  results: T[];
};

async function fetchJamendo<T>(path: string, params: Record<string, string>): Promise<T[]> {
  if (!CLIENT_ID) {
    throw new Error('EXPO_PUBLIC_JAMENDO_CLIENT_ID is not set in .env');
  }
  const qs = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    ...params,
  });
  const url = `${BASE_URL}${path}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Jamendo HTTP ${res.status}`);
  }
  const json = (await res.json()) as JamendoResponse<T>;
  if (json.headers.status !== 'success') {
    throw new Error(json.headers.error_message || 'Jamendo returned an error');
  }
  return json.results;
}

export function getPopularTracks(limit = 8): Promise<JamendoTrack[]> {
  return fetchJamendo<JamendoTrack>('/tracks', {
    limit: String(limit),
    order: 'popularity_total',
    include: 'musicinfo',
  });
}

export function getPopularAlbums(limit = 8): Promise<JamendoAlbum[]> {
  return fetchJamendo<JamendoAlbum>('/albums', {
    limit: String(limit),
    order: 'popularity_total',
  });
}

export function getNewTracks(limit = 8): Promise<JamendoTrack[]> {
  return fetchJamendo<JamendoTrack>('/tracks', {
    limit: String(limit),
    order: 'releasedate_desc',
  });
}

export function getRecentPlaylists(limit = 6): Promise<JamendoPlaylist[]> {
  return fetchJamendo<JamendoPlaylist>('/playlists', {
    limit: String(limit),
    order: 'creationdate_desc',
  });
}
