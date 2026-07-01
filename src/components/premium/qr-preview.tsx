import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import QRCodeStyledBase, {
  type SVGQRCodeStyledProps,
} from 'react-native-qrcode-styled';

import type { QrShape } from '@/data/studio';

// `errorCorrectionLevel` est un vrai prop runtime mais non typé (le package
// `qrcode` n'expose pas ses types ici) → on élargit le type localement.
type QRCodeProps = SVGQRCodeStyledProps & {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
};
const QRCodeStyled =
  QRCodeStyledBase as unknown as React.ComponentType<QRCodeProps>;

type Props = {
  value: string;
  size?: number;
  color?: string;
  shape?: QrShape;
  showLogo?: boolean;
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * QR code stylé (couleur + forme + logo central), correction d'erreur élevée
 * pour rester scannable même avec une teinte de marque.
 * La ref pointe sur la carte blanche englobante (pour captureRef au partage).
 */
export const QrPreview = React.forwardRef<View, Props>(function QrPreview(
  {
    value,
    size = 200,
    color = '#090D12',
    shape,
    showLogo = true,
    padding = 14,
    style,
  },
  ref
) {
  return (
    <View
      ref={ref}
      collapsable={false}
      style={[styles.card, { padding }, style]}
    >
      <QRCodeStyled
        data={value || ' '}
        size={size}
        color={color}
        errorCorrectionLevel="H"
        pieceBorderRadius={shape?.pieceBorderRadius ?? 0}
        isPiecesGlued={shape?.isPiecesGlued}
        pieceLiquidRadius={shape?.pieceLiquidRadius}
        outerEyesOptions={{ borderRadius: shape?.eyeRadius ?? 0, color }}
        innerEyesOptions={{ borderRadius: shape?.eyeRadius ?? 0, color }}
        logo={
          showLogo
            ? {
                href: require('../../../assets/logo.png'),
                padding: 4,
                scale: 0.82,
                hidePieces: true,
              }
            : undefined
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
