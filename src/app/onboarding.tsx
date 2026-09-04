import { useRouter } from 'expo-router';
import { ChartSquare, Flash, ScanBarcode } from 'iconsax-react-native';
import * as React from 'react';
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    Icon: Flash,
    color: '#FF8933',
    labelColor: '#0A0E14',
    glow: 'rgba(255,137,51,0.22)',
    glowOuter: 'rgba(255,137,51,0.08)',
    bg: 'rgba(255,137,51,0.10)',
    border: 'rgba(255,137,51,0.30)',
    title: 'Créez en secondes',
    sub: "Générez des QR codes professionnels d'un simple tap, sans friction.",
  },
  {
    Icon: ScanBarcode,
    color: '#00D2B3',
    labelColor: '#0A0E14',
    glow: 'rgba(0,210,179,0.22)',
    glowOuter: 'rgba(0,210,179,0.08)',
    bg: 'rgba(0,210,179,0.10)',
    border: 'rgba(0,210,179,0.30)',
    title: 'Scannez tout',
    sub: "Décodez instantanément n'importe quel code QR en pointant simplement votre caméra.",
  },
  {
    Icon: ChartSquare,
    color: '#8B5CF6',
    labelColor: '#FFFFFF',
    glow: 'rgba(139,92,246,0.22)',
    glowOuter: 'rgba(139,92,246,0.08)',
    bg: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.30)',
    title: 'Analysez',
    sub: 'Suivez les performances de vos QR en temps réel avec des rapports détaillés.',
  },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const scrollRef = React.useRef<ScrollView>(null);

  const slide = SLIDES[step];

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setStep(page);
  };

  const goNext = () => {
    if (step === SLIDES.length - 1) {
      router.replace('/auth' as never);
      return;
    }
    const next = step + 1;
    scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    setStep(next);
  };

  const skip = () => router.replace('/auth' as never);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Glow ambient — suit la couleur active */}
      <View
        style={[styles.glowAmbient, { backgroundColor: slide.glow }]}
        pointerEvents="none"
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.stepPill, { borderColor: slide.border }]}>
          <Text style={[styles.stepText, { color: slide.color }]}>
            {step + 1} / {SLIDES.length}
          </Text>
        </View>
        <Pressable
          onPress={skip}
          hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
        >
          <Text style={styles.skipText}>Passer</Text>
        </Pressable>
      </View>

      {/* Pager */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
        decelerationRate="fast"
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            {/* Outer soft glow ring */}
            <View
              style={[styles.iconGlowOuter, { backgroundColor: s.glowOuter }]}
              pointerEvents="none"
            />
            {/* Icon box */}
            <View
              style={[
                styles.iconBox,
                { backgroundColor: s.bg, borderColor: s.border },
              ]}
            >
              <s.Icon size={60} color={s.color} variant="Bold" />
            </View>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.sub}>{s.sub}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom — hors du pager pour rester toujours visible */}
      <View style={styles.bottom}>
        {/* Progress dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === step
                  ? { width: 24, backgroundColor: slide.color }
                  : { width: 6, backgroundColor: 'rgba(255,255,255,0.18)' },
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <Pressable
          onPress={goNext}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: slide.color },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.ctaText}>
            {step === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#090D12',
  },

  glowAmbient: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: '18%',
    alignSelf: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A8799',
  },

  pager: { flex: 1 },
  pagerContent: { alignItems: 'center' },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 28,
  },
  iconGlowOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    alignSelf: 'center',
    top: '50%',
    marginTop: -140,
  },
  iconBox: {
    width: 124,
    height: 124,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  sub: {
    fontSize: 15,
    color: '#7A8799',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
  cta: {
    paddingHorizontal: 22,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },
});
