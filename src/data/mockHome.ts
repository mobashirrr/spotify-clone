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
  { id: 'qp-1', title: 'Liked Songs', color: '#6D1F2C' },
  { id: 'qp-2', title: 'Discover Weekly', color: '#1E3A8A' },
  { id: 'qp-3', title: 'Daily Mix 1', color: '#4C1D95' },
  { id: 'qp-4', title: 'Chill Hits', color: '#14532D' },
  { id: 'qp-5', title: 'Lo-fi Beats', color: '#B45309' },
  { id: 'qp-6', title: 'Rock Classics', color: '#B91C1C' },
];

export const shelves: Shelf[] = [
  {
    id: 'made-for-you',
    title: 'Made for you',
    items: [
      { id: 'm-1', title: 'Daily Mix 1', subtitle: 'Tame Impala, MGMT, more', color: '#4C1D95' },
      { id: 'm-2', title: 'Daily Mix 2', subtitle: 'J Dilla, Madlib, more', color: '#3730A3' },
      { id: 'm-3', title: 'Daily Mix 3', subtitle: 'Aphex Twin, Boards of Canada', color: '#0F766E' },
      { id: 'm-4', title: 'Discover Weekly', subtitle: 'Your weekly mixtape', color: '#6D1F2C' },
      { id: 'm-5', title: 'Release Radar', subtitle: 'Catch all the latest', color: '#A16207' },
      { id: 'm-6', title: 'On Repeat', subtitle: 'Songs you love', color: '#047857' },
    ],
  },
  {
    id: 'recently-played',
    title: 'Recently played',
    items: [
      { id: 'r-1', title: 'Currents', subtitle: 'Tame Impala', color: '#C2410C' },
      { id: 'r-2', title: 'In Rainbows', subtitle: 'Radiohead', color: '#0E7490' },
      { id: 'r-3', title: 'Channel Orange', subtitle: 'Frank Ocean', color: '#EA580C' },
      { id: 'r-4', title: 'Random Access Memories', subtitle: 'Daft Punk', color: '#475569' },
      { id: 'r-5', title: 'Blonde', subtitle: 'Frank Ocean', color: '#9A6E4A' },
      { id: 'r-6', title: 'AM', subtitle: 'Arctic Monkeys', color: '#1F2937' },
    ],
  },
  {
    id: 'jump-back-in',
    title: 'Jump back in',
    items: [
      { id: 'j-1', title: 'Late Night Vibes', subtitle: 'Playlist', color: '#3B0764' },
      { id: 'j-2', title: 'Focus Flow', subtitle: 'Playlist', color: '#1E40AF' },
      { id: 'j-3', title: 'Coding Mode', subtitle: 'Playlist', color: '#064E3B' },
      { id: 'j-4', title: 'Sunday Morning', subtitle: 'Playlist', color: '#A16207' },
      { id: 'j-5', title: 'Workout Pump', subtitle: 'Playlist', color: '#991B1B' },
      { id: 'j-6', title: 'Roadtrip Mix', subtitle: 'Playlist', color: '#0F766E' },
    ],
  },
];
