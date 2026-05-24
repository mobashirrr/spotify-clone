export const PALETTES = {
  lavender: { a: '#cdb6ff', b: '#8a6dff', c: '#fde2d2', bg: '#efe7fb' },
  peach:    { a: '#ffd1b5', b: '#ff9a78', c: '#e6c8ff', bg: '#fde8da' },
  mint:     { a: '#bce8d4', b: '#6cc3a3', c: '#f1e3c6', bg: '#e5f3eb' },
  navy:     { a: '#7e8bd9', b: '#2a2a5c', c: '#f0b27a', bg: '#dfe0f1' },
  cream:    { a: '#f7e6c8', b: '#e0b87a', c: '#c7c2eb', bg: '#f6ecd6' },
  smoke:    { a: '#bbb1d4', b: '#675a8a', c: '#f0c9b4', bg: '#e7e1ee' },
  rose:     { a: '#ffc7d1', b: '#e08aa1', c: '#cfe2c1', bg: '#fbe2e6' },
  sky:      { a: '#cfe6f7', b: '#7eb6df', c: '#f5d3b8', bg: '#e2eff8' },
} as const;

export type PaletteName = keyof typeof PALETTES;

export const colors = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceTint: '#F4EFE7',
  border: '#E8E0D3',
  text: '#1A1330',
  textMuted: '#6B6480',
  primary: '#1A1330',
  tabBarInactive: '#8B859C',
};
