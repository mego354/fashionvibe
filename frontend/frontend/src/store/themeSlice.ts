import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

// Define the theme types
export type ThemeColor = 
  | 'default'
  | 'blue'
  | 'green'
  | 'red'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'teal'
  | 'indigo'
  | 'yellow'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'cyan'
  | 'sky'
  | 'violet'
  | 'fuchsia'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'brown'
  | 'crimson'
  | 'midnight'
  | 'coffee'
  | 'royal'
  | 'forest';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeRadius = 'none' | 'small' | 'medium' | 'large' | 'full';
export type ThemeFont = 'sans' | 'serif' | 'mono' | 'cairo' | 'tajawal' | 'readex' | 'noto-sans-arabic';

export interface ThemeState {
  mode: ThemeMode;
  color: ThemeColor;
  radius: ThemeRadius;
  font: ThemeFont;
  rtl: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  color: 'default',
  radius: 'medium',
  font: 'sans',
  rtl: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('fashion-hub-theme-mode', action.payload);
    },
    setColor: (state, action: PayloadAction<ThemeColor>) => {
      state.color = action.payload;
      localStorage.setItem('fashion-hub-theme-color', action.payload);
    },
    setRadius: (state, action: PayloadAction<ThemeRadius>) => {
      state.radius = action.payload;
      localStorage.setItem('fashion-hub-theme-radius', action.payload);
    },
    setFont: (state, action: PayloadAction<ThemeFont>) => {
      state.font = action.payload;
      localStorage.setItem('fashion-hub-theme-font', action.payload);
    },
    setRTL: (state, action: PayloadAction<boolean>) => {
      state.rtl = action.payload;
      localStorage.setItem('fashion-hub-theme-rtl', String(action.payload));
      document.documentElement.dir = action.payload ? 'rtl' : 'ltr';
    },
    initializeTheme: (state) => {
      // Load theme settings from localStorage
      const savedMode = localStorage.getItem('fashion-hub-theme-mode') as ThemeMode;
      const savedColor = localStorage.getItem('fashion-hub-theme-color') as ThemeColor;
      const savedRadius = localStorage.getItem('fashion-hub-theme-radius') as ThemeRadius;
      const savedFont = localStorage.getItem('fashion-hub-theme-font') as ThemeFont;
      const savedRTL = localStorage.getItem('fashion-hub-theme-rtl');

      if (savedMode) state.mode = savedMode;
      if (savedColor) state.color = savedColor;
      if (savedRadius) state.radius = savedRadius;
      if (savedFont) state.font = savedFont;
      if (savedRTL !== null) state.rtl = savedRTL === 'true';
    },
  },
});

export const { setMode, setColor, setRadius, setFont, setRTL, initializeTheme } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme;

export default themeSlice.reducer;
