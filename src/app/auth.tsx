import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Eye, EyeSlash, Lock1, Sms } from 'iconsax-react-native';
import * as React from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/ui';

const AMBER = '#FF8933';

// ─── Glyphes de marque (monochromes, alignés sur la DA) ─────────────────────
function AppleGlyph({ size = 19 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#FFFFFF"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.62 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.09 4.08l-.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </Svg>
  );
}

function GoogleGlyph({ size = 17 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path
        fill="#FFFFFF"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9086c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <Path
        fill="#FFFFFF"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9086-2.2581c-.8059.54-1.8368.859-3.0478.859-2.344 0-4.3282-1.5827-5.036-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <Path
        fill="#FFFFFF"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2822-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z"
      />
      <Path
        fill="#FFFFFF"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1623 6.656 3.5795 9 3.5795z"
      />
    </Svg>
  );
}

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [focused, setFocused] = React.useState<'email' | 'pw' | null>(null);

  const pulse = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.8],
  });
  const enter = () => router.replace('/dashboard' as never);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <Animated.View
        style={[styles.glowAmber, { opacity: glowOpacity }]}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.glowAmberSoft, { opacity: glowOpacity }]}
        pointerEvents="none"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ─── Hero ─── */}
          <View style={styles.hero}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                contentFit="cover"
              />
            </View>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour accéder à votre studio QR.
            </Text>
          </View>

          {/* ─── Formulaire ─── */}
          <View style={styles.form}>
            {/* Email */}
            <View
              style={[styles.field, focused === 'email' && styles.fieldFocused]}
            >
              <Sms
                size={19}
                color={focused === 'email' ? AMBER : '#5A6577'}
                variant="Linear"
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Adresse e-mail"
                placeholderTextColor="#4D5A6B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={styles.fieldInput}
              />
            </View>

            {/* Mot de passe */}
            <View
              style={[styles.field, focused === 'pw' && styles.fieldFocused]}
            >
              <Lock1
                size={19}
                color={focused === 'pw' ? AMBER : '#5A6577'}
                variant="Linear"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                placeholderTextColor="#4D5A6B"
                secureTextEntry={!showPw}
                autoCapitalize="none"
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused(null)}
                style={styles.fieldInput}
              />
              <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
                {showPw ? (
                  <EyeSlash size={19} color="#5A6577" variant="Linear" />
                ) : (
                  <Eye size={19} color="#5A6577" variant="Linear" />
                )}
              </Pressable>
            </View>

            {/* Mot de passe oublié */}
            <Pressable onPress={enter} hitSlop={6} style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </Pressable>

            {/* CTA principal */}
            <Pressable
              onPress={enter}
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.btnPrimaryText}>Se connecter</Text>
            </Pressable>
          </View>

          {/* ─── Séparateur ─── */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continuer avec</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ─── Social — cercles centrés ─── */}
          <View style={styles.socialRow}>
            <Pressable
              onPress={enter}
              style={({ pressed }) => [
                styles.socialCircle,
                pressed && styles.pressed,
              ]}
            >
              <AppleGlyph size={24} />
            </Pressable>
            <Pressable
              onPress={enter}
              style={({ pressed }) => [
                styles.socialCircle,
                pressed && styles.pressed,
              ]}
            >
              <GoogleGlyph size={22} />
            </Pressable>
          </View>

          {/* ─── Invité — CTA secondaire ─── */}
          <Pressable
            onPress={enter}
            style={({ pressed }) => [
              styles.guestBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.guestBtnText}>Continuer sans compte</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#090D12' },
  kav: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  /* Glows ambiants */
  glowAmber: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,137,51,0.14)',
    top: -60,
    right: -80,
  },
  glowAmberSoft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,137,51,0.06)',
    bottom: 10,
    left: -80,
  },

  /* Hero */
  hero: { alignItems: 'center', marginBottom: 30 },
  logoBox: {
    width: 66,
    height: 66,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,137,51,0.35)',
    backgroundColor: 'rgba(255,137,51,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: { width: 44, height: 44, borderRadius: 12 },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#8F98AB',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },

  /* Formulaire */
  form: { gap: 12 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#0D1219',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 20,
  },
  fieldFocused: {
    borderColor: 'rgba(255,137,51,0.55)',
    backgroundColor: 'rgba(255,137,51,0.04)',
  },
  fieldInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter',
    padding: 0,
  },
  forgotWrap: { alignSelf: 'flex-end', paddingVertical: 2 },
  forgotText: { fontSize: 13, color: AMBER, fontWeight: '600' },

  /* CTA principal */
  btnPrimary: {
    height: 52,
    borderRadius: 999,
    backgroundColor: AMBER,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* Séparateur */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: { fontSize: 12, color: '#8F98AB', fontWeight: '500' },

  /* Social — cercles centrés */
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
  socialCircle: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  /* Invité — CTA secondaire */
  guestBtn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  guestBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

  /* États */
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
});
