import type { PaletteName } from '@/theme/colors';

export type QuickPlayItem = {
  id: string;
  title: string;
  palette: PaletteName;
};

export type ShelfItem = {
  id: string;
  title: string;
  subtitle: string;
  palette: PaletteName;
};

export type Shelf = {
  id: string;
  title: string;
  items: ShelfItem[];
};

export const quickPlay: QuickPlayItem[] = [
  { id: 'qp-1', title: 'Liked Songs',     palette: 'rose' },
  { id: 'qp-2', title: 'Discover Weekly', palette: 'lavender' },
  { id: 'qp-3', title: 'Daily Mix 1',     palette: 'smoke' },
  { id: 'qp-4', title: 'Chill Hits',      palette: 'mint' },
  { id: 'qp-5', title: 'Lo-fi Beats',     palette: 'cream' },
  { id: 'qp-6', title: 'Rock Classics',   palette: 'navy' },
];

export const shelves: Shelf[] = [
  {
    id: 'made-for-you',
    title: 'Made for you',
    items: [
      { id: 'm-1', title: 'Daily Mix 1',     subtitle: 'Tame Impala, MGMT, more',      palette: 'lavender' },
      { id: 'm-2', title: 'Daily Mix 2',     subtitle: 'J Dilla, Madlib, more',        palette: 'smoke' },
      { id: 'm-3', title: 'Daily Mix 3',     subtitle: 'Aphex Twin, Boards of Canada', palette: 'sky' },
      { id: 'm-4', title: 'Discover Weekly', subtitle: 'Your weekly mixtape',          palette: 'rose' },
      { id: 'm-5', title: 'Release Radar',   subtitle: 'Catch all the latest',         palette: 'peach' },
      { id: 'm-6', title: 'On Repeat',       subtitle: 'Songs you love',               palette: 'mint' },
    ],
  },
  {
    id: 'recently-played',
    title: 'Recently played',
    items: [
      { id: 'r-1', title: 'Currents',                 subtitle: 'Tame Impala',     palette: 'peach' },
      { id: 'r-2', title: 'In Rainbows',              subtitle: 'Radiohead',       palette: 'sky' },
      { id: 'r-3', title: 'Channel Orange',           subtitle: 'Frank Ocean',     palette: 'cream' },
      { id: 'r-4', title: 'Random Access Memories',   subtitle: 'Daft Punk',       palette: 'navy' },
      { id: 'r-5', title: 'Blonde',                   subtitle: 'Frank Ocean',     palette: 'rose' },
      { id: 'r-6', title: 'AM',                       subtitle: 'Arctic Monkeys',  palette: 'smoke' },
    ],
  },
  {
    id: 'jump-back-in',
    title: 'Jump back in',
    items: [
      { id: 'j-1', title: 'Late Night Vibes', subtitle: 'Playlist', palette: 'smoke' },
      { id: 'j-2', title: 'Focus Flow',       subtitle: 'Playlist', palette: 'navy' },
      { id: 'j-3', title: 'Coding Mode',      subtitle: 'Playlist', palette: 'mint' },
      { id: 'j-4', title: 'Sunday Morning',   subtitle: 'Playlist', palette: 'cream' },
      { id: 'j-5', title: 'Workout Pump',     subtitle: 'Playlist', palette: 'rose' },
      { id: 'j-6', title: 'Roadtrip Mix',     subtitle: 'Playlist', palette: 'sky' },
    ],
  },
];
