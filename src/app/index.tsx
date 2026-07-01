import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChartSquare, Flash, Folder2, ScanBarcode } from 'iconsax-react-native';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/premium';
import { Button, Text } from '@/components/ui';

const AMBER = '#FF8933';
const SCREEN_W = Dimensions.get('window').width;
const CARD_W = Math.floor((SCREEN_W - 20 * 2 - 12) / 2);

const FEATURES = [
  { Icon: Flash, label: 'Générer', desc: 'QR codes pro en 1 tap' },
  { Icon: ScanBarcode, label: 'Scanner', desc: 'Décodage instantané' },
  { Icon: ChartSquare, label: 'Analyser', desc: 'Stats en temps réel' },
  { Icon: Folder2, label: 'Organiser', desc: 'Dossiers & collections' },
] as const;

export default function LandingScreen() {
  const router = useRouter();

  return (
    <ScreenShell scrollable>
      {/* ─── Hero ─── */}
      <View style={styles.hero}>
        <View style={styles.logoRing}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImg}
            contentFit="cover"
          />
        </View>
        <Text style={styles.heroTitle}>Le studio de{'\n'}vos QR codes.</Text>
        <Text style={styles.heroSub}>
          Créez, scannez et analysez vos QR codes{'\n'}avec une précision pro.
        </Text>
      </View>

      {/* ─── Section label ─── */}
      <Text style={styles.sectionLabel}>Ce que vous pouvez faire</Text>

      {/* ─── Feature cards 2×2 ─── */}
      <View style={styles.grid}>
        {FEATURES.map(({ Icon, label, desc }) => (
          <View key={label} style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <View style={styles.cardIcon}>
                <Icon size={22} color={AMBER} variant="Bold" />
              </View>
              <Text style={styles.cardLabel}>{label}</Text>
              <Text style={styles.cardDesc}>{desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ─── CTA — bouton standard de l'app ─── */}
      <Button
        label="Explorer la démo"
        onPress={() => router.push('/onboarding' as never)}
        icon={<Flash size={20} color="#FFFFFF" variant="Bold" />}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  /* Hero */
  hero: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  logoRing: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,137,51,0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,137,51,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logoImg: { width: 44, height: 44, borderRadius: 13 },
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 14,
  },
  heroSub: {
    fontSize: 15,
    color: '#8F98AB',
    lineHeight: 23,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8F98AB',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  /* Grid */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  card: {
    width: CARD_W,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardAccent: { height: 3, backgroundColor: AMBER },
  cardBody: { padding: 16, gap: 8 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,137,51,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  cardDesc: { fontSize: 12, color: '#8F98AB', lineHeight: 17 },
});
