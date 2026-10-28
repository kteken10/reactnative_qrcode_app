import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Flash, Folder2, ScanBarcode } from 'iconsax-react-native';
import * as React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ScreenShell } from '@/components/premium';
import { Text } from '@/components/ui';
import { demoActivity, demoCollections, demoStats } from '@/data/demo';
import { QR_TYPES } from '@/data/studio';
import { useDemoState } from '@/lib/demo-state';

const AMBER = '#FF8933'; // action / marque
const TEAL = '#00D2B3'; // donnée / insight

// ─── Géométrie du carrousel ────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 20; // padding horizontal du ScreenShell
const SPACING = 14; // écart entre deux cartes
const CARD_W = SCREEN_W - H_PAD * 2; // largeur des cartes = inchangée
const STRIDE = CARD_W + SPACING; // pas de défilement / snap
const SIDE = (SCREEN_W - CARD_W) / 2; // marge pour centrer la carte active
const CAROUSEL_H = 330; // hauteur du rail (marge pour l'ombre)
const CARD_COUNT = 3;

// ─── Carte animée : interpole tout selon la position de scroll ──────────────
function CarouselItem({
  index,
  scrollX,
  children,
}: {
  index: number;
  scrollX: SharedValue<number>;
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * STRIDE, index * STRIDE, (index + 1) * STRIDE];

    // Échelle : la carte active est un peu plus grande (« dépasse en hauteur »)
    const scale = interpolate(
      scrollX.value,
      input,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );
    // Retrait vertical : les voisines descendent (plus loin de l'utilisateur)
    const translateY = interpolate(
      scrollX.value,
      input,
      [20, 0, 20],
      Extrapolation.CLAMP
    );
    // Retrait horizontal : les voisines se glissent vers le centre (superposition)
    const translateX = interpolate(
      scrollX.value,
      input,
      [-14, 0, 14],
      Extrapolation.CLAMP
    );
    // Ombre amber dynamique : halo prononcé sur l'active, quasi nul ailleurs
    const shadowOpacity = interpolate(
      scrollX.value,
      input,
      [0.04, 0.42, 0.04],
      Extrapolation.CLAMP
    );
    const shadowRadius = interpolate(
      scrollX.value,
      input,
      [6, 20, 6],
      Extrapolation.CLAMP
    );
    const elevation = interpolate(
      scrollX.value,
      input,
      [1, 12, 1],
      Extrapolation.CLAMP
    );
    // Bordure : léger liseré amber sur l'active
    const borderColor = interpolateColor(scrollX.value, input, [
      'rgba(255,255,255,0.08)',
      'rgba(255,137,51,0.38)',
      'rgba(255,255,255,0.08)',
    ]);

    return {
      shadowOpacity,
      shadowRadius,
      elevation,
      borderColor,
      transform: [{ translateX }, { translateY }, { scale }],
    };
  });

  return (
    <View style={styles.itemWrap}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

// ─── Écran ──────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const { setFolder } = useDemoState();

  const scrollX = useSharedValue(0);
  const activeRef = React.useRef(0);
  const [active, setActive] = React.useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const onMomentumEnd = (e: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const idx = Math.max(
      0,
      Math.min(
        CARD_COUNT - 1,
        Math.round(e.nativeEvent.contentOffset.x / STRIDE)
      )
    );
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
      Haptics.selectionAsync();
    }
  };

  const goToGenerator = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(app)/generator');
  };

  const goToScanner = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(app)/scanner');
  };

  const openCollection = async (name: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFolder(name);
    router.push('/(app)/library');
  };

  return (
    <ScreenShell>
      {/* ─── En-tête ─── */}
      <View className="mb-5 flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8F98AB]">
            Dashboard
          </Text>
          <Text style={styles.greeting}>
            {greeting()}, <Text style={styles.greetingAccent}>bienvenue.</Text>
          </Text>
        </View>
        <View style={styles.uptimeBadge}>
          <Text style={styles.uptimeText}>Mode démo</Text>
        </View>
      </View>

      {/* ─── Carrousel premium (pleine largeur) ─── */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumEnd}
        snapToInterval={STRIDE}
        snapToAlignment="start"
        disableIntervalMomentum
        decelerationRate="fast"
        style={styles.rail}
        contentContainerStyle={styles.railContent}
      >
        {/* Carte 1 — Statistiques */}
        <CarouselItem index={0} scrollX={scrollX}>
          <Text style={styles.cardLabel}>Statistiques</Text>
          <View style={styles.grid2}>
            {demoStats.map((stat) => (
              <View key={stat.label} style={styles.tile}>
                <View style={styles.statAccentBar} />
                <Text style={styles.tileLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statChange}>{stat.change}</Text>
              </View>
            ))}
          </View>
        </CarouselItem>

        {/* Carte 2 — Activité récente */}
        <CarouselItem index={1} scrollX={scrollX}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>Activité récente</Text>
            <Pressable
              onPress={() => router.push('/(app)/analytics')}
              hitSlop={8}
              className="active:opacity-60"
            >
              <Text style={styles.linkAmber}>Tout voir →</Text>
            </Pressable>
          </View>
          {demoActivity.slice(0, 3).map((item, i) => (
            <View
              key={item.title}
              style={[styles.activityRow, i < 2 && styles.activityDivider]}
            >
              <View style={styles.activityBar} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.activityDetail} numberOfLines={1}>
                  {item.detail}
                </Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </CarouselItem>

        {/* Carte 3 — Dossiers */}
        <CarouselItem index={2} scrollX={scrollX}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>Dossiers</Text>
            <Pressable
              onPress={() => openCollection('All')}
              hitSlop={8}
              className="active:opacity-60"
            >
              <Text style={styles.linkAmber}>Bibliothèque →</Text>
            </Pressable>
          </View>
          <View style={styles.grid2}>
            {demoCollections.map((col) => (
              <Pressable
                key={col.id}
                onPress={() => openCollection(col.name)}
                style={styles.folderTile}
                className="active:opacity-75"
              >
                <View style={styles.folderIcon}>
                  <Folder2 size={18} color={AMBER} variant="Bold" />
                </View>
                <Text style={styles.folderName} numberOfLines={1}>
                  {FOLDER_LABELS[col.name] ?? col.name}
                </Text>
                <Text style={styles.folderCount}>{col.count}</Text>
              </Pressable>
            ))}
          </View>
        </CarouselItem>
      </Animated.ScrollView>

      {/* ─── Indicateurs de page ─── */}
      <View style={styles.dotsRow}>
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === active ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* ─── Actions rapides ─── */}
      <View className="mt-5 flex-row gap-3">
        <Pressable
          onPress={goToGenerator}
          style={styles.quickBtnPrimary}
          className="flex-1 flex-row items-center justify-center gap-2 active:opacity-75"
        >
          <Flash size={18} color="#FFFFFF" variant="Bold" />
          <Text className="text-sm font-bold text-white">Créer un QR</Text>
        </Pressable>
        <Pressable
          onPress={goToScanner}
          style={styles.quickBtnOutline}
          className="flex-1 flex-row items-center justify-center gap-2 active:opacity-75"
        >
          <ScanBarcode size={18} color="#8F98AB" variant="Linear" />
          <Text className="text-sm font-bold text-[#8F98AB]">Scanner</Text>
        </Pressable>
      </View>

      {/* ─── Création rapide par type ─── */}
      <Text style={[styles.cardLabel, styles.quickLabel]}>Création rapide</Text>
      <View style={styles.quickGrid}>
        {QR_TYPES.slice(0, 4).map((t) => (
          <Pressable
            key={t.key}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: '/(app)/generator',
                params: { type: t.key },
              });
            }}
            style={styles.quickTile}
            className="active:opacity-75"
          >
            <View style={styles.quickIcon}>
              <t.Icon size={20} color={AMBER} variant="Bold" />
            </View>
            <Text style={styles.quickTileText}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

// Mêmes libellés que les filtres de la bibliothèque.
const FOLDER_LABELS: Record<string, string> = {
  Events: 'Événements',
  Products: 'Produits',
  Private: 'Privé',
};

function greeting() {
  const h = new Date().getHours();
  return h >= 5 && h < 18 ? 'Bonjour' : 'Bonsoir';
}

const styles = StyleSheet.create({
  /* Création rapide */
  quickLabel: { marginTop: 28, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', gap: 10 },
  quickTile: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,137,51,0.12)',
  },
  quickTileText: { fontSize: 13, fontWeight: '600', color: '#E6EAF2' },

  /* En-tête */
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  greetingAccent: { color: AMBER },
  uptimeBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,210,179,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0,210,179,0.28)',
  },
  uptimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 0.2,
  },

  /* Rail du carrousel — pleine largeur (annule le padding du ScreenShell) */
  rail: {
    height: CAROUSEL_H,
    marginHorizontal: -H_PAD,
  },
  railContent: {
    paddingHorizontal: SIDE - SPACING / 2,
    alignItems: 'center',
  },
  itemWrap: {
    width: CARD_W,
    height: CAROUSEL_H,
    marginHorizontal: SPACING / 2,
    justifyContent: 'center',
  },

  /* Carte de haut niveau */
  card: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    // Ombre (amber) — opacité/rayon animés par CarouselItem
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 8 },
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8F98AB',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  linkAmber: { fontSize: 12, fontWeight: '600', color: AMBER },

  /* Grille 2×2 */
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47.5%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0F141C',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statAccentBar: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginBottom: 10,
    backgroundColor: TEAL,
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8F98AB',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  statChange: { marginTop: 4, fontSize: 11, fontWeight: '500', color: TEAL },

  /* Dossiers */
  folderTile: {
    width: '47.5%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0F141C',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  folderIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,137,51,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.25)',
  },
  folderName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  folderCount: { marginTop: 2, fontSize: 20, fontWeight: '700', color: TEAL },

  /* Activité */
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  activityBar: {
    width: 3,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
    flexShrink: 0,
    backgroundColor: AMBER,
  },
  activityInfo: { flex: 1, gap: 3 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  activityDetail: { fontSize: 12, color: '#8F98AB' },
  activityTime: {
    fontSize: 11,
    color: '#5F6B7D',
    fontWeight: '500',
  },

  /* Dots */
  dotsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { height: 6, borderRadius: 999 },
  dotActive: { width: 22, backgroundColor: AMBER },
  dotInactive: { width: 6, backgroundColor: 'rgba(255,255,255,0.18)' },

  /* Actions rapides */
  quickBtnPrimary: { height: 52, borderRadius: 999, backgroundColor: AMBER },
  quickBtnOutline: {
    height: 52,
    borderRadius: 999,
    backgroundColor: '#0D1219',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
});
