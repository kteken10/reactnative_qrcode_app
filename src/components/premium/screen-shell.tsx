import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';

type ScreenShellProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export function ScreenShell({ children, scrollable = true }: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const pulse = React.useRef(new Animated.Value(0)).current;
  const drift = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    driftLoop.start();
    return () => {
      pulseLoop.stop();
      driftLoop.stop();
    };
  }, []);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.75],
  });
  const glowScale = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  // Tab bar clearance
  const tabBarHeight = 49 + (insets.bottom > 0 ? insets.bottom : 16);

  const contentNode = scrollable ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: tabBarHeight + 20 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      bounces={Platform.OS === 'ios'}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.fill,
        styles.nonScrollContent,
        { paddingBottom: tabBarHeight + 8 },
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Ambient glow orbs — behind everything */}
      <Animated.View
        style={[styles.glowAmber, { opacity: glowOpacity }]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.glowTeal,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.glowViolet,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
        pointerEvents="none"
      />

      {/* ── Inline pill header ── */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerPill}>
          <BlurView
            intensity={72}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          {/* Overlay sombre pour garantir le contraste quel que soit le glow derrière */}
          <View style={[StyleSheet.absoluteFill, styles.headerOverlay]} />
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                contentFit="cover"
              />
              <Text style={styles.headerTitle}>QR Studio</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable / non-scrollable content */}
      {contentNode}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#090D12',
  },
  fill: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nonScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* Header */
  headerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerPill: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  headerOverlay: {
    backgroundColor: 'rgba(9,13,18,0.58)',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 7,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },

  /* Glow orbs */
  glowAmber: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,137,51,0.18)',
    left: -80,
    top: 0,
  },
  glowTeal: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0,210,179,0.10)',
    right: -60,
    top: 120,
  },
  glowViolet: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,137,51,0.06)',
    bottom: 100,
    left: 40,
  },
});
