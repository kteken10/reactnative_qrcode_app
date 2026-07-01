import * as React from 'react';

type DemoMode = 'all' | 'favorites' | 'recent' | 'shared';

type DemoStateValue = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  folder: string;
  setFolder: React.Dispatch<React.SetStateAction<string>>;
  mode: DemoMode;
  setMode: React.Dispatch<React.SetStateAction<DemoMode>>;
  favoritesOnly: boolean;
  setFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  resetFilters: () => void;
};

const DemoStateContext = React.createContext<DemoStateValue | undefined>(
  undefined
);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = React.useState('');
  const [folder, setFolder] = React.useState('All');
  const [mode, setMode] = React.useState<DemoMode>('all');
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [favorites, setFavorites] = React.useState<Set<string>>(
    new Set(['qr-1', 'qr-3'])
  );

  const toggleFavorite = React.useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetFilters = React.useCallback(() => {
    setSearch('');
    setFolder('All');
    setMode('all');
    setFavoritesOnly(false);
    setFavorites(new Set(['qr-1', 'qr-3']));
  }, []);

  const value = React.useMemo(
    () => ({
      search,
      setSearch,
      folder,
      setFolder,
      mode,
      setMode,
      favoritesOnly,
      setFavoritesOnly,
      favorites,
      toggleFavorite,
      resetFilters,
    }),
    [favoritesOnly, favorites, folder, mode, resetFilters, search, toggleFavorite]
  );

  return (
    <DemoStateContext.Provider value={value}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState() {
  const context = React.useContext(DemoStateContext);
  if (!context) {
    throw new Error('useDemoState must be used within a DemoStateProvider');
  }
  return context;
}
