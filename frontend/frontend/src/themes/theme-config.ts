import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme configuration
export type ThemeColor = {
  name: string;
  id: string;
  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
};

// Define all 29 theme variations
export const themeColors: ThemeColor[] = [
  // Blue themes
  {
    name: 'Ocean Blue',
    id: 'ocean-blue',
    primaryColor: '#3B82F6',
    primaryLight: '#93C5FD',
    primaryDark: '#1D4ED8',
    accentColor: '#F59E0B',
    bgLight: '#F8FAFC',
    bgDark: '#0F172A',
  },
  {
    name: 'Royal Blue',
    id: 'royal-blue',
    primaryColor: '#4F46E5',
    primaryLight: '#A5B4FC',
    primaryDark: '#3730A3',
    accentColor: '#EC4899',
    bgLight: '#F9FAFB',
    bgDark: '#111827',
  },
  {
    name: 'Sky Blue',
    id: 'sky-blue',
    primaryColor: '#0EA5E9',
    primaryLight: '#BAE6FD',
    primaryDark: '#0369A1',
    accentColor: '#F97316',
    bgLight: '#F0F9FF',
    bgDark: '#0C4A6E',
  },
  
  // Green themes
  {
    name: 'Emerald',
    id: 'emerald',
    primaryColor: '#10B981',
    primaryLight: '#A7F3D0',
    primaryDark: '#047857',
    accentColor: '#8B5CF6',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B',
  },
  {
    name: 'Mint',
    id: 'mint',
    primaryColor: '#34D399',
    primaryLight: '#D1FAE5',
    primaryDark: '#059669',
    accentColor: '#EC4899',
    bgLight: '#F0FDFA',
    bgDark: '#134E4A',
  },
  {
    name: 'Forest',
    id: 'forest',
    primaryColor: '#22C55E',
    primaryLight: '#BBF7D0',
    primaryDark: '#15803D',
    accentColor: '#F43F5E',
    bgLight: '#F0FDF4',
    bgDark: '#14532D',
  },
  
  // Purple themes
  {
    name: 'Lavender',
    id: 'lavender',
    primaryColor: '#8B5CF6',
    primaryLight: '#DDD6FE',
    primaryDark: '#6D28D9',
    accentColor: '#F59E0B',
    bgLight: '#FAF5FF',
    bgDark: '#4C1D95',
  },
  {
    name: 'Violet',
    id: 'violet',
    primaryColor: '#A855F7',
    primaryLight: '#E9D5FF',
    primaryDark: '#7E22CE',
    accentColor: '#10B981',
    bgLight: '#F5F3FF',
    bgDark: '#581C87',
  },
  {
    name: 'Amethyst',
    id: 'amethyst',
    primaryColor: '#9333EA',
    primaryLight: '#D8B4FE',
    primaryDark: '#6B21A8',
    accentColor: '#F97316',
    bgLight: '#F3E8FF',
    bgDark: '#3B0764',
  },
  
  // Red themes
  {
    name: 'Ruby',
    id: 'ruby',
    primaryColor: '#EF4444',
    primaryLight: '#FECACA',
    primaryDark: '#B91C1C',
    accentColor: '#3B82F6',
    bgLight: '#FEF2F2',
    bgDark: '#7F1D1D',
  },
  {
    name: 'Crimson',
    id: 'crimson',
    primaryColor: '#DC2626',
    primaryLight: '#FEE2E2',
    primaryDark: '#991B1B',
    accentColor: '#10B981',
    bgLight: '#FEF2F2',
    bgDark: '#7F1D1D',
  },
  {
    name: 'Rose',
    id: 'rose',
    primaryColor: '#F43F5E',
    primaryLight: '#FECDD3',
    primaryDark: '#BE123C',
    accentColor: '#8B5CF6',
    bgLight: '#FFF1F2',
    bgDark: '#881337',
  },
  
  // Orange themes
  {
    name: 'Amber',
    id: 'amber',
    primaryColor: '#F59E0B',
    primaryLight: '#FDE68A',
    primaryDark: '#B45309',
    accentColor: '#3B82F6',
    bgLight: '#FFFBEB',
    bgDark: '#78350F',
  },
  {
    name: 'Tangerine',
    id: 'tangerine',
    primaryColor: '#F97316',
    primaryLight: '#FED7AA',
    primaryDark: '#C2410C',
    accentColor: '#6366F1',
    bgLight: '#FFF7ED',
    bgDark: '#7C2D12',
  },
  {
    name: 'Coral',
    id: 'coral',
    primaryColor: '#FB923C',
    primaryLight: '#FFEDD5',
    primaryDark: '#EA580C',
    accentColor: '#8B5CF6',
    bgLight: '#FFF7ED',
    bgDark: '#7C2D12',
  },
  
  // Neutral themes
  {
    name: 'Slate',
    id: 'slate',
    primaryColor: '#64748B',
    primaryLight: '#CBD5E1',
    primaryDark: '#334155',
    accentColor: '#F43F5E',
    bgLight: '#F8FAFC',
    bgDark: '#0F172A',
  },
  {
    name: 'Gray',
    id: 'gray',
    primaryColor: '#6B7280',
    primaryLight: '#E5E7EB',
    primaryDark: '#374151',
    accentColor: '#EC4899',
    bgLight: '#F9FAFB',
    bgDark: '#111827',
  },
  {
    name: 'Zinc',
    id: 'zinc',
    primaryColor: '#71717A',
    primaryLight: '#E4E4E7',
    primaryDark: '#3F3F46',
    accentColor: '#10B981',
    bgLight: '#FAFAFA',
    bgDark: '#18181B',
  },
  
  // Teal themes
  {
    name: 'Teal',
    id: 'teal',
    primaryColor: '#14B8A6',
    primaryLight: '#99F6E4',
    primaryDark: '#0F766E',
    accentColor: '#F43F5E',
    bgLight: '#F0FDFA',
    bgDark: '#134E4A',
  },
  {
    name: 'Cyan',
    id: 'cyan',
    primaryColor: '#06B6D4',
    primaryLight: '#A5F3FC',
    primaryDark: '#0E7490',
    accentColor: '#F97316',
    bgLight: '#ECFEFF',
    bgDark: '#164E63',
  },
  
  // Pink themes
  {
    name: 'Pink',
    id: 'pink',
    primaryColor: '#EC4899',
    primaryLight: '#FBCFE8',
    primaryDark: '#BE185D',
    accentColor: '#3B82F6',
    bgLight: '#FDF2F8',
    bgDark: '#831843',
  },
  {
    name: 'Fuchsia',
    id: 'fuchsia',
    primaryColor: '#D946EF',
    primaryLight: '#F5D0FE',
    primaryDark: '#A21CAF',
    accentColor: '#10B981',
    bgLight: '#FDF4FF',
    bgDark: '#701A75',
  },
  
  // Yellow themes
  {
    name: 'Gold',
    id: 'gold',
    primaryColor: '#EAB308',
    primaryLight: '#FEF08A',
    primaryDark: '#A16207',
    accentColor: '#8B5CF6',
    bgLight: '#FEFCE8',
    bgDark: '#713F12',
  },
  {
    name: 'Lemon',
    id: 'lemon',
    primaryColor: '#FACC15',
    primaryLight: '#FEF9C3',
    primaryDark: '#CA8A04',
    accentColor: '#6366F1',
    bgLight: '#FEFCE8',
    bgDark: '#713F12',
  },
  
  // Indigo themes
  {
    name: 'Indigo',
    id: 'indigo',
    primaryColor: '#6366F1',
    primaryLight: '#C7D2FE',
    primaryDark: '#4338CA',
    accentColor: '#F59E0B',
    bgLight: '#EEF2FF',
    bgDark: '#312E81',
  },
  {
    name: 'Sapphire',
    id: 'sapphire',
    primaryColor: '#4F46E5',
    primaryLight: '#C7D2FE',
    primaryDark: '#3730A3',
    accentColor: '#F97316',
    bgLight: '#EEF2FF',
    bgDark: '#312E81',
  },
  
  // Special themes
  {
    name: 'Egyptian Blue',
    id: 'egyptian-blue',
    primaryColor: '#2563EB',
    primaryLight: '#BFDBFE',
    primaryDark: '#1E40AF',
    accentColor: '#F59E0B',
    bgLight: '#EFF6FF',
    bgDark: '#1E3A8A',
  },
  {
    name: 'Nile Green',
    id: 'nile-green',
    primaryColor: '#059669',
    primaryLight: '#A7F3D0',
    primaryDark: '#047857',
    accentColor: '#8B5CF6',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B',
  },
  {
    name: 'Desert Sand',
    id: 'desert-sand',
    primaryColor: '#D97706',
    primaryLight: '#FDE68A',
    primaryDark: '#B45309',
    accentColor: '#3B82F6',
    bgLight: '#FFFBEB',
    bgDark: '#78350F',
  },
];

// Default theme
export const defaultTheme: ThemeColor = themeColors[0];

// Get theme by ID
export const getThemeById = (id: string): ThemeColor => {
  return themeColors.find(theme => theme.id === id) || defaultTheme;
};

// Get CSS variables for a theme
export const getThemeCssVars = (theme: ThemeColor, isDark: boolean = false) => {
  return {
    '--primary': theme.primaryColor,
    '--primary-light': theme.primaryLight,
    '--primary-dark': theme.primaryDark,
    '--accent': theme.accentColor,
    '--background': isDark ? theme.bgDark : theme.bgLight,
    '--foreground': isDark ? theme.bgLight : theme.bgDark,
  };
};
