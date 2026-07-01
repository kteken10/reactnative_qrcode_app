import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import {
  CloseCircle,
  Copy,
  Share as ShareIcon,
  TickCircle,
} from 'iconsax-react-native';
import * as React from 'react';
import {
  Alert,
  InteractionManager,
  Pressable,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import Barcode from 'react-native-barcode-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';

import { QrPreview } from '@/components/premium';
import { Text } from '@/components/ui';
import { shapeByKey } from '@/data/studio';

const AMBER = '#FF8933';
const INK = '#090D12';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Bouton d'action avec ressort au press ──────────────────────────────────
function ActionButton({
  onPress,
  variant,
  children,
}: {
  onPress: () => void;
  variant: 'primary' | 'glass';
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 18, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      style={[
        styles.actionBtn,
        variant === 'primary' ? styles.actionPrimary : styles.actionGlass,
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function QrResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    value: string;
    kind?: string;
    fg?: string;
    shape?: string;
    format?: string;
  }>();
  const value = params.value ?? '';
  const kind = params.kind === 'barcode' ? 'barcode' : 'qr';
  const fg = params.fg || INK;
  const shape = shapeByKey(params.shape);
  const format = params.format || 'CODE128';

  const captureRefView = React.useRef<View>(null);
  const [ready, setReady] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setReady(true));
    return () => {
      task.cancel();
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const dismiss = () => router.back();

  const handleCopy = async () => {
    try {
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(value);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      await Share.share({ message: value });
    }
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Partage indisponible', 'Non disponible sur cet appareil.');
      return;
    }
    if (!captureRefView.current) {
      Alert.alert('Erreur', "Le code n'est pas encore prêt.");
      return;
    }
    try {
      const raw = await captureRef(captureRefView, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      const uri = raw.startsWith('file://') ? raw : `file://${raw}`;
      await Sharing.shareAsync(uri, {
        dialogTitle: 'Partager le code',
        mimeType: 'image/png',
        UTI: 'public.png',
      });
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible de capturer le code.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Backdrop flou + assombrissement — tap pour fermer */}
      <Pressable style={StyleSheet.absoluteFill} onPress={dismiss}>
        <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.backdropTint]} />
      </Pressable>

      {/* Carte centrée compacte */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          {/* Fermer */}
          <Pressable onPress={dismiss} hitSlop={10} style={styles.closeBtn}>
            <CloseCircle size={26} color="#5A6577" variant="Bold" />
          </Pressable>

          {/* Aperçu (fond blanc pour la lisibilité) */}
          {ready ? (
            kind === 'barcode' ? (
              <View
                ref={captureRefView}
                collapsable={false}
                style={styles.barcodeCard}
              >
                <Barcode
                  value={value || '0'}
                  format={format}
                  singleBarWidth={2}
                  lineColor={INK}
                  backgroundColor="#FFFFFF"
                  maxWidth={240}
                  height={92}
                  onError={() => {}}
                />
              </View>
            ) : (
              <QrPreview
                ref={captureRefView}
                value={value}
                color={fg}
                shape={shape}
                size={196}
                style={styles.qrShadow}
              />
            )
          ) : (
            <View style={styles.placeholder} />
          )}

          {/* Texte */}
          <Text style={styles.title}>
            {kind === 'barcode' ? 'Votre code-barres' : 'Votre QR code'}
          </Text>
          <Text style={styles.subtitle}>
            Scannez, copiez ou partagez votre code en un geste.
          </Text>

          {/* Aperçu du contenu encodé */}
          {value ? (
            <View style={styles.payloadChip}>
              <Text style={styles.payloadText} numberOfLines={1}>
                {value}
              </Text>
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actions}>
            <ActionButton onPress={handleCopy} variant="glass">
              {copied ? (
                <>
                  <TickCircle size={18} color={AMBER} variant="Bold" />
                  <Text style={styles.actionTextGlass}>Copié</Text>
                </>
              ) : (
                <>
                  <Copy size={18} color="#FFFFFF" variant="Linear" />
                  <Text style={styles.actionTextGlass}>Copier</Text>
                </>
              )}
            </ActionButton>

            <ActionButton onPress={handleShare} variant="primary">
              <ShareIcon size={18} color="#FFFFFF" variant="Bold" />
              <Text style={styles.actionTextPrimary}>Partager</Text>
            </ActionButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdropTint: { backgroundColor: 'rgba(9,13,18,0.72)' },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: '#12161C',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.5,
    shadowRadius: 36,
    elevation: 24,
  },
  closeBtn: { position: 'absolute', top: 14, right: 14, zIndex: 2 },

  qrShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  barcodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  placeholder: {
    width: 196,
    height: 196,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    opacity: 0.6,
  },

  title: {
    marginTop: 22,
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#8F98AB',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },

  payloadChip: {
    marginTop: 14,
    maxWidth: '100%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  payloadText: { fontSize: 12, color: '#8F98AB', fontFamily: 'monospace' },

  actions: { flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' },
  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionGlass: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  actionPrimary: {
    backgroundColor: AMBER,
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  actionTextGlass: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  actionTextPrimary: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
