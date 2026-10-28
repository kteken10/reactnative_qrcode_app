import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ChartSquare,
  Edit2,
  Home2,
  Scan,
  Setting2,
} from 'iconsax-react-native';
import { Platform, StyleSheet, View } from 'react-native';

// Sur Android, BlurView ne floute pas par défaut : la barre serait transparente
// et le contenu défilerait sous les icônes. On y met un fond presque opaque.
function TabBarBackground() {
  if (Platform.OS === 'android') {
    return <View style={[StyleSheet.absoluteFill, styles.androidBar]} />;
  }
  return (
    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
  );
}

const styles = StyleSheet.create({
  androidBar: {
    backgroundColor: '#0B1016',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
});

export default function AppTabsLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF8933',
          tabBarInactiveTintColor: '#7A8799',
          tabBarBackground: () => <TabBarBackground />,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopColor: 'rgba(255,255,255,0.06)',
            borderTopWidth: 0.5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.2,
            marginBottom: 4,
          },
          tabBarItemStyle: {
            paddingTop: 6,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Home2
                size={22}
                color={color}
                variant={focused ? 'Bold' : 'Linear'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="generator"
          options={{
            title: 'Studio',
            tabBarIcon: ({ color, focused }) => (
              <Edit2
                size={22}
                color={color}
                variant={focused ? 'Bold' : 'Linear'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ color, focused }) => (
              <Scan
                size={22}
                color={color}
                variant={focused ? 'Bold' : 'Linear'}
              />
            ),
          }}
        />
        <Tabs.Screen name="library" options={{ href: null }} />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Aperçu',
            tabBarIcon: ({ color, focused }) => (
              <ChartSquare
                size={22}
                color={color}
                variant={focused ? 'Bold' : 'Linear'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Réglages',
            tabBarIcon: ({ color, focused }) => (
              <Setting2
                size={22}
                color={color}
                variant={focused ? 'Bold' : 'Linear'}
              />
            ),
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </>
  );
}
