export type ThemeMode = 'color' | 'mono';

export interface Theme {
  header: string;
  headerText: string;
  bg: string;
  card: string;
  title: string;
  text: string;
  subtext: string;
  accent: string;
  accentText: string;
  badge: string;
  badgeText: string;
  border: string;
  input: string;
}

export const themes: Record<ThemeMode, Theme> = {
  color: {
    header: '#15803d',
    headerText: '#fff',
    bg: '#f0fdf4',
    card: '#fff',
    title: '#15803d',
    text: '#111827',
    subtext: '#6b7280',
    accent: '#16a34a',
    accentText: '#fff',
    badge: '#d1fae5',
    badgeText: '#065f46',
    border: '#e5e7eb',
    input: '#f9fafb',
  },
  mono: {
    header: '#000000',
    headerText: '#fff',
    bg: '#1a1a1a',
    card: '#2a2a2a',
    title: '#ffffff',
    text: '#e5e5e5',
    subtext: '#a0a0a0',
    accent: '#555555',
    accentText: '#ffffff',
    badge: '#3a3a3a',
    badgeText: '#d4d4d4',
    border: '#444444',
    input: '#333333',
  },
};