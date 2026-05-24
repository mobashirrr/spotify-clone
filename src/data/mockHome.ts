export type QuickPlayItem = {
  id: string;
  title: string;
  color: string;
};

export type ShelfItem = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
};

export type Shelf = {
  id: string;
  title: string;
  items: ShelfItem[];
};

export const quickPlay: QuickPlayItem[] = [
  { id: 'qp-1', title: 'Liked Songs', color: '#5038A0' },
  { id: 'qp-2', title: 'Discover Weekly', color: '#1E3264' },
  { id: 'qp-3', title: 'Daily Mix 1', color: '#8D67AB' },
  { id: 'qp-4', title: 'Chill Hits', color: '#148A08' },
  { id: 'qp-5', title: 'Lo-fi Beats', color: '#E61E32' },
  { id: 'qp-6', title: 'Rock Classics', color: '#BC5900' },
];

export const shelves: Shelf[] = [
  {
    id: 'made-for-you',
    title: 'Made for you',
    items: [
      { id: 'm-1', title: 'Daily Mix 1', subtitle: 'Tame Impala, MGMT, more', color: '#E13300' },
      { id: 'm-2', title: 'Daily Mix 2', subtitle: 'J Dilla, Madlib, more', color: '#1E3264' },
      { id: 'm-3', title: 'Daily Mix 3', subtitle: 'Aphex Twin, Boards of Canada', color: '#477D95' },
      { id: 'm-4', title: 'Discover Weekly', subtitle: 'Your weekly mixtape', color: '#8D67AB' },
      { id: 'm-5', title: 'Release Radar', subtitle: 'Catch all the latest', color: '#503750' },
      { id: 'm-6', title: 'On Repeat', subtitle: 'Songs you love', color: '#BC5900' },
    ],
  },
  {
    id: 'recently-played',
    title: 'Recently played',
    items: [
      { id: 'r-1', title: 'Currents', subtitle: 'Tame Impala', color: '#E61E32' },
      { id: 'r-2', title: 'In Rainbows', subtitle: 'Radiohead', color: '#777777' },
      { id: 'r-3', title: 'Channel Orange', subtitle: 'Frank Ocean', color: '#148A08' },
      { id: 'r-4', title: 'Random Access Memories', subtitle: 'Daft Punk', color: '#0D72EA' },
      { id: 'r-5', title: 'Blonde', subtitle: 'Frank Ocean', color: '#1E3264' },
      { id: 'r-6', title: 'AM', subtitle: 'Arctic Monkeys', color: '#503750' },
    ],
  },
  {
    id: 'jump-back-in',
    title: 'Jump back in',
    items: [
      { id: 'j-1', title: 'Late Night Vibes', subtitle: 'Playlist', color: '#5038A0' },
      { id: 'j-2', title: 'Focus Flow', subtitle: 'Playlist', color: '#1E3264' },
      { id: 'j-3', title: 'Coding Mode', subtitle: 'Playlist', color: '#148A08' },
      { id: 'j-4', title: 'Sunday Morning', subtitle: 'Playlist', color: '#BC5900' },
      { id: 'j-5', title: 'Workout Pump', subtitle: 'Playlist', color: '#E61E32' },
      { id: 'j-6', title: 'Roadtrip Mix', subtitle: 'Playlist', color: '#477D95' },
    ],
  },
];
