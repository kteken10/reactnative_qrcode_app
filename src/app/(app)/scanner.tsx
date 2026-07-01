import * as Haptics from 'expo-haptics';
import {
  Copy,
  InfoCircle,
  ScanBarcode,
  Share as ShareIcon,
  Warning2,
} from 'iconsax-react-native';
import * as React from 'react';
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';

type ScanResult = { type: string; data: string };
type CameraViewType = React.ComponentType<any>;

const FRAME_SIZE = 240;

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();

  // Camera loaded dynamically — fails gracefully in Expo Go
  const [CameraView, setCameraView] = React.useState<CameraViewType | null>(
    null
  );
  const [useCameraPermissions, setUseCameraPermissions] =
    React.useState<any>(null);
  const [cameraUnavailable, setCameraUnavailable] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);

  // Scanner state
  const [scanned, setScanned] = React.useState(false);
  const [result, setResult] = React.useState<ScanResult | null>(null);

  // Fallback input (when camera unavailable)
  const [manualInput, setManualInput] = React.useState('');

  // Animations
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;
  const resultAnim = React.useRef(new Animated.Value(0)).current;

  // Load expo-camera dynamically
  React.useEffect(() => {
    import('expo-camera')
      .then((mod) => {
        setCameraView(() => mod.CameraView as CameraViewType);
        setUseCameraPermissions(() => mod.useCameraPermissions);
        setCameraReady(true);
      })
      .catch(() => {
        setCameraUnavailable(true);
      });
  }, []);

  // Scan line animation
  React.useEffect(() => {
    if (scanned) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanned]);

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 4],
  });
  const resultTranslateY = resultAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const handleScanned = async (data: string, type = 'qr') => {
    if (scanned || !data.trim()) return;
    setScanned(true);
    setResult({ type, data: data.trim() });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(resultAnim, {
      toValue: 1,
      damping: 28,
      stiffness: 420,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handleReset = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(resultAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setScanned(false);
      setResult(null);
      setManualInput('');
    });
  };

  const handleOpen = async () => {
    if (!result?.data) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (
      result.data.startsWith('http://') ||
      result.data.startsWith('https://')
    ) {
      Linking.openURL(result.data).catch(() =>
        Alert.alert('Erreur', "Impossible d'ouvrir ce lien.")
      );
    } else {
      Alert.alert('Contenu scanné', result.data);
    }
  };

  const handleShare = async () => {
    if (!result?.data) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({ message: result.data });
  };

  // ─── Fallback: camera unavailable ───
  if (cameraUnavailable) {
    return (
      <View style={[styles.container, styles.fallbackContainer]}>
        <View style={[styles.fallbackContent, { paddingTop: insets.top + 32 }]}>
          <View style={styles.fallbackIconBox}>
            <ScanBarcode size={40} color="#FF8933" variant="Linear" />
          </View>
          <Text style={styles.fallbackTitle}>Scanner un code</Text>
          <Text style={styles.fallbackSub}>
            La caméra native nécessite un build de développement.{'\n'}
            Collez ou entrez un contenu (QR ou code-barres) pour tester.
          </Text>

          <View style={styles.warningBadge}>
            <Warning2 size={14} color="#FF8933" variant="Linear" />
            <Text style={styles.warningText}>Expo Go — mode simulation</Text>
          </View>

          {/* Manual entry */}
          <TextInput
            value={manualInput}
            onChangeText={setManualInput}
            placeholder="https://... ou texte QR"
            placeholderTextColor="#4D5A6B"
            style={styles.fallbackInput}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => handleScanned(manualInput)}
          />
          <Pressable
            onPress={() => handleScanned(manualInput)}
            style={({ pressed }) => [
              styles.fallbackBtn,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.fallbackBtnText}>Simuler le scan</Text>
          </Pressable>
        </View>

        {result && (
          <Animated.View
            style={[
              styles.resultPanel,
              {
                paddingBottom: insets.bottom + 16,
                transform: [{ translateY: resultTranslateY }],
              },
            ]}
          >
            <ResultPanelContent
              result={result}
              onOpen={handleOpen}
              onShare={handleShare}
              onReset={handleReset}
            />
          </Animated.View>
        )}
      </View>
    );
  }

  // ─── Loading ───
  if (!cameraReady) {
    return <View style={styles.container} />;
  }

  // ─── Real camera (dev build) ───
  return (
    <CameraViewWrapper
      CameraView={CameraView!}
      useCameraPermissions={useCameraPermissions}
      insets={insets}
      scanned={scanned}
      result={result}
      scanLineY={scanLineY}
      resultTranslateY={resultTranslateY}
      onScanned={handleScanned}
      onOpen={handleOpen}
      onShare={handleShare}
      onReset={handleReset}
    />
  );
}

// ─── Camera wrapper (only rendered when expo-camera loaded) ───
function CameraViewWrapper({
  CameraView,
  useCameraPermissions,
  insets,
  scanned,
  result,
  scanLineY,
  resultTranslateY,
  onScanned,
  onOpen,
  onShare,
  onReset,
}: any) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.fallbackContainer]}>
        <View style={[styles.fallbackContent, { paddingTop: insets.top + 32 }]}>
          <ScanBarcode size={48} color="#FF8933" variant="Linear" />
          <Text style={styles.fallbackTitle}>Accès caméra requis</Text>
          <Text style={styles.fallbackSub}>
            QR Studio a besoin de votre caméra pour scanner les codes.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.fallbackBtn,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.fallbackBtnText}>Autoriser l'accès</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code39',
            'code93',
            'code128',
            'itf14',
            'codabar',
            'pdf417',
            'datamatrix',
            'aztec',
          ],
        }}
        onBarcodeScanned={
          scanned ? undefined : ({ type, data }: any) => onScanned(data, type)
        }
      />

      {/* Overlay darkening */}
      <View style={styles.overlayDark} pointerEvents="none" />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.topTitle}>QR & Codes-barres</Text>
      </View>

      {/* Scan frame */}
      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={styles.frame}>
          <View style={[styles.corner, styles.cTL]} />
          <View style={[styles.corner, styles.cTR]} />
          <View style={[styles.corner, styles.cBL]} />
          <View style={[styles.corner, styles.cBR]} />
          {!scanned && (
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLineY }] },
              ]}
            />
          )}
          {scanned && (
            <View style={styles.successOverlay}>
              <InfoCircle size={28} color="#FF8933" variant="Bold" />
            </View>
          )}
        </View>
        {scanned && result ? (
          <View style={styles.inlineResult}>
            <Text style={styles.inlineResultType}>
              {result.type === 'qr' ? 'QR Code' : result.type.toUpperCase()}
            </Text>
            <Text style={styles.inlineResultData} numberOfLines={2}>
              {result.data}
            </Text>
          </View>
        ) : (
          <Text style={styles.hint}>
            Alignez un QR code ou un code-barres dans le cadre
          </Text>
        )}
      </View>

      {result && (
        <Animated.View
          style={[
            styles.resultPanel,
            {
              paddingBottom: insets.bottom + 16,
              transform: [{ translateY: resultTranslateY }],
            },
          ]}
        >
          <ResultPanelContent
            result={result}
            onOpen={onOpen}
            onShare={onShare}
            onReset={onReset}
          />
        </Animated.View>
      )}
    </View>
  );
}

// ─── Shared result panel content ───
function ResultPanelContent({
  result,
  onOpen,
  onShare,
  onReset,
}: {
  result: ScanResult;
  onOpen: () => void;
  onShare: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <View style={styles.handle} />
      <View style={styles.resultCard}>
        <Text style={styles.resultType}>
          {result.type === 'qr' ? 'QR Code' : result.type.toUpperCase()}
        </Text>
        <Text style={styles.resultData} numberOfLines={3}>
          {result.data}
        </Text>
      </View>
      <View style={styles.resultActions}>
        <Pressable
          onPress={onOpen}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionPrimary,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.actionPrimaryText}>Ouvrir</Text>
        </Pressable>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionOutline,
            pressed && { opacity: 0.7 },
          ]}
        >
          <ShareIcon size={18} color="#FFFFFF" variant="Linear" />
        </Pressable>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionOutline,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Copy size={18} color="#FFFFFF" variant="Linear" />
        </Pressable>
      </View>
      <Pressable onPress={onReset} style={styles.resetRow}>
        <Text style={styles.resetText}>Scanner un autre code</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D12' },

  /* Fallback */
  fallbackContainer: { justifyContent: 'flex-start' },
  fallbackContent: { alignItems: 'center', paddingHorizontal: 32 },
  fallbackIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,137,51,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 10,
    textAlign: 'center',
  },
  fallbackSub: {
    fontSize: 14,
    color: '#8F98AB',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 16,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,137,51,0.08)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.20)',
    marginBottom: 24,
  },
  warningText: { fontSize: 12, color: '#FF8933', fontWeight: '600' },
  fallbackInput: {
    width: '100%',
    backgroundColor: '#0D1219',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 12,
  },
  fallbackBtn: {
    width: '100%',
    height: 52,
    borderRadius: 999,
    backgroundColor: '#FF8933',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  /* Camera overlay */
  overlayDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },

  /* Top bar */
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 12,
    zIndex: 10,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  /* Frame */
  frameWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#FF8933',
  },
  cTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FF8933',
    shadowColor: '#FF8933',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,137,51,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  hint: {
    marginTop: 20,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  inlineResult: {
    marginTop: 18,
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 280,
  },
  inlineResultType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF8933',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  inlineResultData: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: 'rgba(255,137,51,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.22)',
    overflow: 'hidden',
  },

  /* Result panel */
  resultPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D1219',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#090D12',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,137,51,0.20)',
    padding: 16,
    marginBottom: 14,
  },
  resultType: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8933',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  resultData: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    fontWeight: '500',
  },
  resultActions: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  actionBtn: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimary: { flex: 1, backgroundColor: '#FF8933' },
  actionPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  actionOutline: {
    width: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  resetRow: { alignItems: 'center', paddingVertical: 10 },
  resetText: { fontSize: 13, color: '#7A8799', fontWeight: '500' },
});
