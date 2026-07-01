import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrangeVerticalSquare,
  Clock,
  Flash,
  Global,
  Heart,
  Link21,
  Message,
  Profile2User,
  Send2,
  Wifi,
} from 'iconsax-react-native';
import * as React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { EmptyState, ScreenShell, SearchBar } from '@/components/premium';
import { Text } from '@/components/ui';
import { demoQrs, type DemoTheme } from '@/data/demo';
import { useDemoState } from '@/lib/demo-state';

// ─── Layout ──────────────────────────────────────────────────────────────────

const SCREEN_W = Dimensions.get('window').width;
const SHELL_PAD = 20;
const CARD_GAP = 10;
const CARD_W = Math.floor((SCREEN_W - SHELL_PAD * 2 - CARD_GAP) / 2);

// ─── Design tokens ────────────────────────────────────────────────────────────

// Monochrome absolu : toutes les catégories partagent l'accent amber
const ACCENT: Record<DemoTheme, string> = {
  amber: '#FF8933',
  teal: '#FF8933',
  violet: '#FF8933',
  rose: '#FF8933',
};
const ACCENT_BG: Record<DemoTheme, string> = {
  amber: 'rgba(255,137,51,0.12)',
  teal: 'rgba(255,137,51,0.12)',
  violet: 'rgba(255,137,51,0.12)',
  rose: 'rgba(255,137,51,0.12)',
};
const ACCENT_BORDER: Record<DemoTheme, string> = {
  amber: 'rgba(255,137,51,0.25)',
  teal: 'rgba(255,137,51,0.25)',
  violet: 'rgba(255,137,51,0.25)',
  rose: 'rgba(255,137,51,0.25)',
};

// ─── Filters ─────────────────────────────────────────────────────────────────

const FOLDERS = [
  { label: 'Tous', value: 'All' },
  { label: 'Branding', value: 'Branding' },
  { label: 'Événements', value: 'Events' },
  { label: 'Produits', value: 'Products' },
  { label: 'Privé', value: 'Private' },
];

const MODES = [
  { key: 'all', label: 'Tous', Icon: null },
  { key: 'recent', label: 'Récents', Icon: Clock },
  { key: 'shared', label: 'Partagés', Icon: Send2 },
] as const;

const SORT_OPTIONS = [
  { key: 'date', label: 'Date' },
  { key: 'scans', label: 'Scans' },
  { key: 'name', label: 'A – Z' },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]['key'];

// ─── Type icon ────────────────────────────────────────────────────────────────

function TypeIcon({ type, color }: { type: string; color: string }) {
  const p = { size: 16, color, variant: 'Bold' as const };
  switch (type.toLowerCase()) {
    case 'url':
      return <Global {...p} />;
    case 'wi-fi':
      return <Wifi {...p} />;
    case 'contact':
      return <Profile2User {...p} />;
    case 'text':
      return <Message {...p} />;
    default:
      return <Link21 {...p} />;
  }
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const router = useRouter();
  const {
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
  } = useDemoState();

  const [sortBy, setSortBy] = React.useState<SortKey>('date');

  const folderCounts = React.useMemo(() => {
    const map: Record<string, number> = { All: demoQrs.length };
    demoQrs.forEach((q) => {
      map[q.folder] = (map[q.folder] ?? 0) + 1;
    });
    return map;
  }, []);

  const sorted = React.useMemo(() => {
    const list = demoQrs.filter((item) => {
      const isFav = favorites.has(item.id);
      const matchesFolder = folder === 'All' || item.folder === folder;
      const matchesSearch =
        !search ||
        [item.title, item.subtitle, item.content, item.folder]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesMode =
        mode === 'all' ||
        (mode === 'recent' && item.updatedAt.includes('il y a')) ||
        (mode === 'shared' && item.scans > 700);
      return (
        matchesFolder &&
        matchesSearch &&
        matchesMode &&
        (!favoritesOnly || isFav)
      );
    });
    if (sortBy === 'scans') return [...list].sort((a, b) => b.scans - a.scans);
    if (sortBy === 'name')
      return [...list].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    return list;
  }, [search, folder, mode, favoritesOnly, favorites, sortBy]);

  const hasFilters =
    search.length > 0 || folder !== 'All' || mode !== 'all' || favoritesOnly;

  const cycleSortBy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSortBy((prev) => {
      const idx = SORT_OPTIONS.findIndex((s) => s.key === prev);
      return SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length].key;
    });
  };

  const handleReset = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetFilters();
    setSortBy('date');
  };

  const sortLabel = SORT_OPTIONS.find((s) => s.key === sortBy)?.label ?? 'Date';

  return (
    <ScreenShell>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bibliothèque</Text>
          <View style={styles.headerMeta}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {sorted.length} code{sorted.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={cycleSortBy}
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <ArrangeVerticalSquare size={16} color="#8F98AB" variant="Linear" />
            <Text style={styles.iconBtnLabel}>{sortLabel}</Text>
          </Pressable>
          {hasFilters && (
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.clearBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.clearBtnText}>Effacer</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ─── Search ─── */}
      <SearchBar value={search} onChangeText={setSearch} />

      {/* ─── Folder tabs ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterMargin}
      >
        {FOLDERS.map((f) => {
          const active = folder === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFolder(f.value)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterChipLabel,
                  active && styles.filterChipLabelActive,
                ]}
              >
                {f.label}
              </Text>
              <View
                style={[styles.filterBadge, active && styles.filterBadgeActive]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    active && styles.filterBadgeTextActive,
                  ]}
                >
                  {folderCounts[f.value] ?? 0}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ─── Mode + favorites row ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterMarginSm}
      >
        {MODES.map(({ key, label, Icon }) => {
          const active = mode === key;
          return (
            <Pressable
              key={key}
              onPress={() => setMode(key)}
              style={[styles.modeChip, active && styles.modeChipActive]}
            >
              {Icon ? (
                <Icon
                  size={12}
                  color={active ? '#FF8933' : '#8F98AB'}
                  variant={active ? 'Bold' : 'Linear'}
                />
              ) : null}
              <Text
                style={[
                  styles.modeChipLabel,
                  active && styles.modeChipLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
        <View style={styles.modeDivider} />
        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFavoritesOnly((v) => !v);
          }}
          style={[styles.modeChip, favoritesOnly && styles.modeChipFav]}
        >
          <Heart
            size={12}
            color={favoritesOnly ? '#FF8933' : '#8F98AB'}
            variant={favoritesOnly ? 'Bold' : 'Linear'}
          />
          <Text
            style={[
              styles.modeChipLabel,
              favoritesOnly && styles.modeChipLabelActive,
            ]}
          >
            Favoris
          </Text>
        </Pressable>
      </ScrollView>

      {/* ─── Empty state ─── */}
      {sorted.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'Aucun résultat' : 'Bibliothèque vide'}
          description={
            hasFilters
              ? 'Modifiez les filtres ou effacez la sélection.'
              : 'Créez votre premier QR code et il apparaîtra ici.'
          }
          action={
            hasFilters ? (
              <Pressable onPress={handleReset} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Effacer les filtres</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/(app)/generator');
                }}
                style={styles.emptyBtn}
              >
                <View style={styles.emptyBtnInner}>
                  <Flash size={16} color="#FFFFFF" variant="Bold" />
                  <Text style={styles.emptyBtnText}>Créer un QR code</Text>
                </View>
              </Pressable>
            )
          }
        />
      ) : (
        <View style={styles.grid}>
          {sorted.map((item) => {
            const accent = item.accent as DemoTheme;
            const color = ACCENT[accent];
            const isFav = favorites.has(item.id);
            const scansLabel =
              item.scans >= 1000
                ? `${(item.scans / 1000).toFixed(1)}k`
                : String(item.scans);

            return (
              <Pressable
                key={item.id}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={({ pressed }) => [
                  styles.card,
                  pressed && {
                    opacity: 0.88,
                    borderColor: ACCENT_BORDER[accent],
                  },
                ]}
              >
                {/* Top */}
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: ACCENT_BG[accent],
                        borderColor: ACCENT_BORDER[accent],
                      },
                    ]}
                  >
                    <TypeIcon type={item.type} color={color} />
                  </View>
                  <Pressable
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      toggleFavorite(item.id);
                    }}
                    hitSlop={10}
                    style={[styles.favBtn, isFav && styles.favBtnActive]}
                  >
                    <Heart
                      size={14}
                      color={isFav ? '#FF8933' : '#4D5A6B'}
                      variant={isFav ? 'Bold' : 'Linear'}
                    />
                  </Pressable>
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>

                <View style={styles.separator} />

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.typePill,
                      { backgroundColor: ACCENT_BG[accent] },
                    ]}
                  >
                    <Text style={[styles.typeText, { color }]}>
                      {item.type}
                    </Text>
                  </View>
                  <Text style={[styles.scansText, { color: '#00D2B3' }]}>
                    {scansLabel}
                  </Text>
                </View>
                <Text style={styles.updatedAt}>{item.updatedAt}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </ScreenShell>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,137,51,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8933',
    letterSpacing: 0.1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconBtnLabel: {
    fontSize: 11,
    color: '#8F98AB',
    fontWeight: '600',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,137,51,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.25)',
  },
  clearBtnText: { fontSize: 11, color: '#FF8933', fontWeight: '600' },

  /* Filter rows */
  filterRow: {
    flexDirection: 'row',
    gap: 7,
    paddingRight: 16,
  },
  filterMargin: { marginBottom: 8 },
  filterMarginSm: { marginBottom: 14 },

  /* Folder chips */
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterChipActive: {
    backgroundColor: '#FF8933',
    borderColor: '#FF8933',
  },
  filterChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8F98AB',
  },
  filterChipLabelActive: { color: '#FFFFFF' },
  filterBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeActive: { backgroundColor: 'rgba(0,0,0,0.20)' },
  filterBadgeText: { fontSize: 10, fontWeight: '700', color: '#8F98AB' },
  filterBadgeTextActive: { color: '#FFFFFF' },

  /* Mode chips */
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modeChipActive: {
    backgroundColor: 'rgba(255,137,51,0.10)',
    borderColor: 'rgba(255,137,51,0.35)',
  },
  modeChipFav: {
    backgroundColor: 'rgba(255,137,51,0.10)',
    borderColor: 'rgba(255,137,51,0.35)',
  },
  modeChipLabel: { fontSize: 12, fontWeight: '600', color: '#8F98AB' },
  modeChipLabelActive: { color: '#FF8933' },
  modeDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'center',
    marginHorizontal: 2,
  },

  /* Grid */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  card: {
    width: CARD_W,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0F141C',
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtnActive: { backgroundColor: 'rgba(255,137,51,0.10)' },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#8F98AB',
    fontWeight: '400',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  typePill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 },
  typeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scansText: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
  updatedAt: { fontSize: 10, color: '#4D5A6B', fontWeight: '400' },

  /* Empty */
  emptyBtn: {
    backgroundColor: '#FF8933',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
