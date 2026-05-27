import type { PaletteName } from '@/theme/colors';

export type HomeCardKind = 'album' | 'playlist' | 'track';

export type HomeCard = {
  id: string;
  kind: HomeCardKind;
  targetId: string;
  title: string;
  subtitle?: string;
  palette: PaletteName;
  imageUrl?: string;
};

export type Shelf = {
  id: string;
  title: string;
  items: HomeCard[];
};
