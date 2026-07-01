import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Flash } from 'iconsax-react-native';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Barcode from 'react-native-barcode-svg';

import { QrPreview, ScreenShell, SectionHeader } from '@/components/premium';
import { Input, Text } from '@/components/ui';
import {
  BARCODE_FORMATS,
  QR_COLORS,
  QR_SHAPES,
  QR_TYPES,
  type QrField,
} from '@/data/studio';
import { useDemoState } from '@/lib/demo-state';
import { buildPayload } from '@/lib/qr-builders';

const AMBER = '#FF8933';
const INK = '#090D12';

type Kind = 'qr' | 'barcode';

function isBarcodeValid(format: string, value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  switch (format) {
    case 'EAN13':
      return /^\d{12,13}$/.test(v);
    case 'UPC':
      return /^\d{11,12}$/.test(v);
    case 'CODE39':
      return /^[0-9A-Za-z\-. $/+%]+$/.test(v);
    default:
      return true; // CODE128
  }
}

// Petit glyphe illustrant une forme de QR (grille 3×3, sans rendre un vrai QR)
function ShapeGlyph({ radius, color }: { radius: number; color: string }) {
  return (
    <View style={styles.glyphGrid}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.glyphDot,
            { borderRadius: radius, backgroundColor: color },
          ]}
        />
      ))}
    </View>
  );
}

export default function GeneratorScreen() {
  const router = useRouter();
  const { setMode } = useDemoState();

  const [kind, setKind] = React.useState<Kind>('qr');

  // QR state
  const [typeIdx, setTypeIdx] = React.useState(0);
  const [fields, setFields] = React.useState<Record<string, string>>({
    security: 'WPA',
  });
  const [colorIdx, setColorIdx] = React.useState(0);
  const [shapeIdx, setShapeIdx] = React.useState(0);

  // Barcode state
  const [formatIdx, setFormatIdx] = React.useState(0);
  const [barcodeValue, setBarcodeValue] = React.useState('');

  const currentType = QR_TYPES[typeIdx];
  const currentFormat = BARCODE_FORMATS[formatIdx];
  const color = QR_COLORS[colorIdx].value;
  const shape = QR_SHAPES[shapeIdx];

  const qrValue = buildPayload(currentType.key, fields);
  const barcodeOk = isBarcodeValid(currentFormat.key, barcodeValue);
  const canGenerate = kind === 'qr' ? qrValue.length > 0 : barcodeOk;

  const setField = (key: string, val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const handleGenerate = async () => {
    if (!canGenerate) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode('shared');
    if (kind === 'qr') {
      router.push({
        pathname: '/qr-result',
        params: { kind: 'qr', value: qrValue, fg: color, shape: shape.key },
      });
    } else {
      router.push({
        pathname: '/qr-result',
        params: {
          kind: 'barcode',
          value: barcodeValue.trim(),
          format: currentFormat.key,
        },
      });
    }
  };

  const renderField = (field: QrField) => {
    if (field.type === 'chips') {
      const selected = fields[field.key] ?? field.options?.[0].key;
      return (
        <View key={field.key} style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <View style={styles.chipRow}>
            {field.options?.map((opt) => {
              const active = selected === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setField(field.key, opt.key)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    style={active ? styles.chipTextActive : styles.chipText}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      );
    }
    return (
      <Input
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={fields[field.key] ?? ''}
        onChangeText={(v) => setField(field.key, v)}
        secureTextEntry={field.secure}
        multiline={field.multiline}
        autoCapitalize={
          field.keyboardType === 'email-address' || field.keyboardType === 'url'
            ? 'none'
            : 'sentences'
        }
        keyboardType={
          field.keyboardType === 'url'
            ? 'url'
            : field.keyboardType === 'email-address'
              ? 'email-address'
              : field.keyboardType === 'phone-pad'
                ? 'phone-pad'
                : 'default'
        }
      />
    );
  };

  return (
    <ScreenShell>
      <SectionHeader eyebrow="Studio" title="Atelier de création" />

      {/* ─── Sélecteur de mode ─── */}
      <View style={styles.segment}>
        {(['qr', 'barcode'] as const).map((k) => {
          const active = kind === k;
          return (
            <Pressable
              key={k}
              onPress={() => setKind(k)}
              style={[styles.segBtn, active && styles.segBtnActive]}
            >
              <Text style={active ? styles.segTextActive : styles.segText}>
                {k === 'qr' ? 'QR Code' : 'Code-barres'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ─── Aperçu + personnalisation (même carte) ─── */}
      <View style={styles.previewCard}>
        {kind === 'qr' ? (
          <>
            {qrValue ? (
              <QrPreview
                value={qrValue}
                color={color}
                shape={shape}
                size={150}
              />
            ) : (
              <View style={styles.previewEmpty}>
                <Text style={styles.previewEmptyText}>
                  Votre QR apparaîtra ici
                </Text>
              </View>
            )}

            {/* Personnalisation en place — compacte */}
            <View style={styles.persoDivider} />

            <View style={styles.persoRow}>
              <Text style={styles.persoLabel}>Couleur</Text>
              <View style={styles.persoOptions}>
                {QR_COLORS.map((c, index) => {
                  const active = colorIdx === index;
                  return (
                    <Pressable
                      key={c.value}
                      onPress={() => setColorIdx(index)}
                      hitSlop={6}
                      style={[styles.colorDot, active && styles.colorDotActive]}
                    >
                      <View
                        style={[styles.colorFill, { backgroundColor: c.value }]}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.persoRow}>
              <Text style={styles.persoLabel}>Forme</Text>
              <View style={styles.persoOptions}>
                {QR_SHAPES.map((s, index) => {
                  const active = shapeIdx === index;
                  const r = s.key === 'square' ? 1 : s.key === 'soft' ? 2 : 5;
                  return (
                    <Pressable
                      key={s.key}
                      onPress={() => setShapeIdx(index)}
                      hitSlop={6}
                      style={[styles.shapeBox, active && styles.shapeBoxActive]}
                    >
                      <ShapeGlyph
                        radius={r}
                        color={active ? AMBER : '#8F98AB'}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        ) : barcodeOk ? (
          <View style={styles.barcodeCard}>
            <Barcode
              value={barcodeValue.trim()}
              format={currentFormat.key}
              singleBarWidth={2}
              lineColor={INK}
              backgroundColor="#FFFFFF"
              maxWidth={250}
              height={84}
              onError={() => {}}
            />
          </View>
        ) : (
          <View style={styles.previewEmpty}>
            <Text style={styles.previewEmptyText}>
              Votre code-barres apparaîtra ici
            </Text>
          </View>
        )}
      </View>

      {kind === 'qr' ? (
        <>
          {/* ─── Type ─── */}
          <Text style={styles.sectionLabel}>Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeRow}
            style={styles.typeScroll}
          >
            {QR_TYPES.map((type, index) => {
              const active = typeIdx === index;
              const Icon = type.Icon;
              return (
                <Pressable
                  key={type.key}
                  onPress={() => setTypeIdx(index)}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                >
                  <Icon
                    size={18}
                    color={active ? AMBER : '#8F98AB'}
                    variant={active ? 'Bold' : 'Linear'}
                  />
                  <Text
                    style={active ? styles.typeTextActive : styles.typeText}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ─── Configuration contextuelle ─── */}
          <View style={[styles.card, { marginBottom: 28 }]}>
            <Text style={styles.cardLabel}>Contenu</Text>
            {currentType.fields.map(renderField)}
          </View>
        </>
      ) : (
        <>
          {/* ─── Format ─── */}
          <Text style={styles.sectionLabel}>Format</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeRow}
            style={styles.typeScroll}
          >
            {BARCODE_FORMATS.map((fmt, index) => {
              const active = formatIdx === index;
              return (
                <Pressable
                  key={fmt.key}
                  onPress={() => setFormatIdx(index)}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                >
                  <Text
                    style={active ? styles.typeTextActive : styles.typeText}
                  >
                    {fmt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ─── Valeur ─── */}
          <View style={[styles.card, { marginBottom: 28 }]}>
            <Text style={styles.cardLabel}>Valeur</Text>
            <Input
              label={currentFormat.label}
              placeholder={currentFormat.hint}
              value={barcodeValue}
              onChangeText={setBarcodeValue}
              autoCapitalize="characters"
              keyboardType={
                currentFormat.key === 'EAN13' || currentFormat.key === 'UPC'
                  ? 'number-pad'
                  : 'default'
              }
            />
            <Text style={styles.hintInline}>{currentFormat.hint}</Text>
          </View>
        </>
      )}

      {/* ─── Générer ─── */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={!canGenerate}
          activeOpacity={0.85}
          style={[
            styles.generateBtn,
            !canGenerate && styles.generateBtnDisabled,
          ]}
        >
          <Flash size={20} color="#FFFFFF" variant="Bold" />
          <Text style={styles.generateBtnText}>
            {kind === 'qr' ? 'Générer le QR code' : 'Générer le code-barres'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.generateHint}>
          Génération instantanée · Aucune inscription requise
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  /* Segment */
  segment: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  segBtn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnActive: { backgroundColor: AMBER },
  segText: { fontSize: 14, fontWeight: '600', color: '#8F98AB' },
  segTextActive: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  /* Aperçu + personnalisation (même carte) */
  previewCard: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  previewEmpty: {
    width: 176,
    height: 176,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  previewEmptyText: { fontSize: 13, color: '#5A6577', textAlign: 'center' },
  barcodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Personnalisation compacte (dans la carte d'aperçu) */
  persoDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginTop: 18,
    marginBottom: 4,
  },
  persoRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  persoLabel: { fontSize: 12, fontWeight: '600', color: '#8F98AB' },
  persoOptions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotActive: { borderColor: AMBER },
  colorFill: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  shapeBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  shapeBoxActive: {
    borderColor: 'rgba(255,137,51,0.55)',
    backgroundColor: 'rgba(255,137,51,0.10)',
  },
  glyphGrid: {
    width: 22,
    height: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  glyphDot: { width: 5, height: 5 },

  /* Section labels */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8F98AB',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  /* Type / format chips */
  typeScroll: { marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  typeChipActive: {
    borderColor: 'rgba(255,137,51,0.55)',
    backgroundColor: 'rgba(255,137,51,0.12)',
  },
  typeText: { fontSize: 13, color: '#8F98AB', fontWeight: '500' },
  typeTextActive: { fontSize: 13, color: AMBER, fontWeight: '600' },

  /* Cards */
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8F98AB',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
  },

  /* Field (chips type) */
  fieldBlock: { marginBottom: 4 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8F98AB',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipActive: {
    borderColor: 'rgba(255,137,51,0.55)',
    backgroundColor: 'rgba(255,137,51,0.12)',
  },
  chipText: { fontSize: 13, color: '#8F98AB', fontWeight: '500' },
  chipTextActive: { fontSize: 13, color: AMBER, fontWeight: '600' },

  /* Hints */
  hintInline: { marginTop: 2, fontSize: 12, color: '#5A6577' },

  /* CTA */
  ctaWrapper: { width: '100%', alignItems: 'center' },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 52,
    borderRadius: 999,
    backgroundColor: AMBER,
  },
  generateBtnDisabled: { opacity: 0.4 },
  generateBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  generateHint: {
    marginTop: 10,
    fontSize: 12,
    color: '#4D5A6B',
    textAlign: 'center',
    fontWeight: '500',
  },
});
