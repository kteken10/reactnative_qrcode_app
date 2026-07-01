import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Home2, Edit2, Scan, ChartSquare, Setting2 } from 'iconsax-react-native';

function TabBarBackground() {
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
  );
}

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
              <Home2 size={22} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
          }}
        />
        <Tabs.Screen
          name="generator"
          options={{
            title: 'Studio',
            tabBarIcon: ({ color, focused }) => (
              <Edit2 size={22} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ color, focused }) => (
              <Scan size={22} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Aperçu',
            tabBarIcon: ({ color, focused }) => (
              <ChartSquare size={22} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Réglages',
            tabBarIcon: ({ color, focused }) => (
              <Setting2 size={22} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </>
  );
}
