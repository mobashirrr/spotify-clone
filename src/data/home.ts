import type { PaletteName } from '@/theme/colors';

export type HomeCard = {
  id: string;
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
