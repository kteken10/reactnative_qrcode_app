// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DemoStateProvider } from '@/lib/demo-state';
import { ThemeModeProvider } from '@/lib/theme-mode';
import { useThemeConfig } from '@/lib/use-theme-config';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <DemoStateProvider>
        <Providers>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#090D12' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="start" />
            <Stack.Screen
              name="onboarding"
              options={{ animation: 'fade_from_bottom' }}
            />
            <Stack.Screen
              name="auth"
              options={{ animation: 'fade_from_bottom' }}
            />
            <Stack.Screen name="(app)" />
            <Stack.Screen
              name="qr-result"
              options={{
                presentation: 'transparentModal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </Providers>
      </DemoStateProvider>
    </ThemeModeProvider>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <ThemeProvider value={theme}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
