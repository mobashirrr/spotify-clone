import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { PALETTES, type PaletteName } from '@/theme/colors';

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(seed: number, arr: T[]): T {
  return arr[seed % arr.length];
}

type Props = {
  palette: PaletteName;
  seed?: string;
  size?: number;
  radius?: number;
};

export function AlbumArt({ palette, seed = '', size = 144, radius = 16 }: Props) {
  const p = PALETTES[palette];
  const h = hashStr(seed || palette);
  const angle = pick(h, [115, 145, 165, 200, 235, 305]);

  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const start = { x: 0.5 - dx / 2, y: 0.5 - dy / 2 };
  const end = { x: 0.5 + dx / 2, y: 0.5 + dy / 2 };

  const big = size >= 180;
  const b1Size = big ? size * 1.1 : size * 0.85;
  const b2Size = big ? size * 1.3 : size * 1.0;
  const b3Size = big ? size * 0.9 : size * 0.65;

  const b1Left = (((h % 40) + 5) / 100) * size;
  const b1Top = ((((h >> 2) % 30) + 5) / 100) * size;
  const b2Right = ((((h >> 4) % 40) + 5) / 100) * size;
  const b2Bottom = ((((h >> 6) % 30) + 5) / 100) * size;
  const b3Left = ((((h >> 8) % 50) + 15) / 100) * size;
  const b3Top = ((((h >> 10) % 50) + 25) / 100) * size;

  return (
    <LinearGradient
      colors={[p.bg, p.a, p.b]}
      locations={[0, 0.55, 1]}
      start={start}
      end={end}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: b1Left,
          top: b1Top,
          width: b1Size,
          height: b1Size,
          borderRadius: b1Size / 2,
          backgroundColor: p.a,
          opacity: 0.55,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: b2Right,
          bottom: b2Bottom,
          width: b2Size,
          height: b2Size,
          borderRadius: b2Size / 2,
          backgroundColor: p.b,
          opacity: 0.45,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: b3Left,
          top: b3Top,
          width: b3Size,
          height: b3Size,
          borderRadius: b3Size / 2,
          backgroundColor: p.c,
          opacity: 0.4,
        }}
      />
    </LinearGradient>
  );
}
