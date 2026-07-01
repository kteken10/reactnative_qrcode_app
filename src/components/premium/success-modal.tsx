import * as React from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import { Copy, Share as ShareIcon } from 'iconsax-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

type SuccessModalProps = {
  open: boolean;
  title: string;
  qrValue: string;
  onClose?: () => void;
};

export function SuccessModal({ open, title, qrValue, onClose }: SuccessModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const qrRef = React.useRef<View>(null);

  // QR monté une seule fois après la première ouverture — évite le freeze
  // au premier clic (SVG parse coûteux). Restes monté sur les ouvertures suivantes.
  const qrMountedRef = React.useRef(false);
  const [qrMounted, setQrMounted] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 480,
          mass: 0.7,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();

      // Différer le rendu du QR jusqu'après l'animation (~280ms)
      if (!qrMountedRef.current) {
        const t = setTimeout(() => {
          qrMountedRef.current = true;
          setQrMounted(true);
        }, 280);
        return () => clearTimeout(t);
      }
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  const handleCopy = async () => {
    const { Share } = await import('react-native');
    await Share.share({ message: qrValue });
  };

  const handleShare = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Partage indisponible', "Non disponible sur cet appareil.");
      return;
    }
    if (!qrRef.current) {
      Alert.alert('Erreur', "Le QR code n'est pas encore prêt.");
      return;
    }
    try {
      const raw = await captureRef(qrRef, { format: 'png', quality: 1, result: 'tmpfile' });
      const uri = raw.startsWith('file://') ? raw : `file://${raw}`;
      await Sharing.shareAsync(uri, {
        dialogTitle: 'Partager le QR code',
        mimeType: 'image/png',
        UTI: 'public.png',
      });
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible de capturer le QR code.');
    }
  };

  return (
    <RNModal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 28), transform: [{ translateY }] },
        ]}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Partagez ou copiez votre QR code</Text>

        {/* Zone QR — placeholder pendant le chargement, puis QRCode SVG */}
        <View style={styles.qrWrapper}>
          <View ref={qrRef} collapsable={false} style={styles.qrCard}>
            {qrMounted ? (
              <QRCode
                value={qrValue || ' '}
                size={220}
                backgroundColor="#FFFFFF"
                color="#090D12"
                quietZone={12}
              />
            ) : (
              <View style={styles.qrPlaceholder} />
            )}
          </View>
          <Text style={styles.qrPayload} numberOfLines={1}>{qrValue}</Text>
        </View>

        {/* Boutons */}
        <View style={styles.btnRow}>
          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => [styles.btn, styles.btnOutline, pressed && { opacity: 0.75 }]}
          >
            <Copy size={18} color="#FFFFFF" variant="Linear" />
            <Text style={styles.btnOutlineText}>Copier</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && { opacity: 0.75 }]}
          >
            <ShareIcon size={18} color="#FFFFFF" variant="Linear" />
            <Text style={styles.btnPrimaryText}>Partager</Text>
          </Pressable>
        </View>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.70)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D1219',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.20)',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 13,
    color: '#8892A4',
    textAlign: 'center',
    lineHeight: 19,
  },
  qrWrapper: { alignItems: 'center', marginBottom: 28 },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
  },
  qrPayload: {
    marginTop: 14,
    fontSize: 12,
    color: '#8892A4',
    textAlign: 'center',
    fontFamily: 'monospace',
    maxWidth: 260,
  },
  btnRow: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    height: 54,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimary: { backgroundColor: '#FF8933' },
  btnOutline: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  btnOutlineText: { color: '#FFFFFF', fontSize: 15, fontWeight: '500' },
});
