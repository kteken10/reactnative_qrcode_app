import * as React from 'react';
import { useColorScheme } from 'nativewind';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
  resolvedMode: 'light' | 'dark';
};

const ThemeModeContext = React.createContext<ThemeModeContextValue | undefined>(
  undefined
);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>('system');
  const { colorScheme } = useColorScheme();

  const resolvedMode =
    mode === 'system' ? (colorScheme === 'dark' ? 'dark' : 'light') : mode;

  const value = React.useMemo(
    () => ({ mode, setMode, resolvedMode }),
    [mode, resolvedMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = React.useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }

  return context;
}
