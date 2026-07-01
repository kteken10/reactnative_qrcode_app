import * as React from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

import { Button, Text } from '@/components/ui';
import { ScreenShell, SectionHeader } from '@/components/premium';
import { useDemoState } from '@/lib/demo-state';
import { ThemeMode, useThemeMode } from '@/lib/theme-mode';

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: 'Système', value: 'system' },
  { label: 'Clair', value: 'light' },
  { label: 'Sombre', value: 'dark' },
];

const INITIAL_NOTIFICATIONS = [
  { label: 'Alertes scan et résumés hebdomadaires', active: true },
  { label: 'Notifications de partage de collection', active: true },
  { label: "Rappels d'intégration premium", active: false },
];

export default function SettingsScreen() {
  const { mode, setMode } = useThemeMode();
  const { resetFilters } = useDemoState();
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);

  const toggleNotification = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, active: !item.active } : item
      )
    );
  };

  const handleShare = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync('https://expo.dev', {
        dialogTitle: 'Share QR Studio',
      });
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser',
      'Remettre tous les filtres et favoris à leurs valeurs par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            resetFilters();
            setNotifications(INITIAL_NOTIFICATIONS);
          },
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    Alert.alert('Abonnement', "La gestion de l'abonnement se fait via l'App Store.");
  };

  return (
    <ScreenShell>
      <SectionHeader
        eyebrow="Réglages"
        title="Préférences"
      />

      {/* Account Section */}
      <View className="mb-5 rounded-[28px] border border-white/[0.08] bg-white/5 p-5">
        <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#8F98AB]">
          Compte
        </Text>
        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#FF8933]/20 border border-[#FF8933]/30">
            <Text className="text-xl font-semibold text-[#FF8933]">MD</Text>
          </View>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-2">
              <Text className="text-base font-semibold text-white">Mickael Delormes</Text>
              <View className="rounded-full bg-[#FF8933]/15 border border-[#FF8933]/30 px-2 py-0.5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-[#FF8933]">
                  Pro
                </Text>
              </View>
            </View>
            <Text className="text-sm text-[#8F98AB]">hello@aurum.studio</Text>
          </View>
        </View>
        <View className="mt-4 h-px bg-white/[0.07]" />
        <Pressable
          onPress={handleManageSubscription}
          className="mt-4 flex-row items-center justify-between active:opacity-60"
        >
          <Text className="text-sm font-medium text-[#8F98AB]">Gérer l'abonnement</Text>
          <Text className="text-sm text-[#8F98AB]">›</Text>
        </Pressable>
      </View>

      {/* Appearance Section */}
      <View className="mb-5 rounded-[28px] border border-white/[0.08] bg-white/5 p-5">
        <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8F98AB]">
          Apparence
        </Text>
        <Text className="mb-4 text-base font-semibold text-white">Thème</Text>
        <View className="flex-row gap-2">
          {themeOptions.map((option) => {
            const isActive = mode === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setMode(option.value)}
                className={`flex-1 items-center rounded-full px-4 py-3 border ${
                  isActive
                    ? 'border-[#FF8933] bg-[#FF8933]'
                    : 'border-white/[0.08] bg-white/5'
                }`}
              >
                <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-[#8F98AB]'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Notifications Section */}
      <View className="mb-5 rounded-[28px] border border-white/[0.08] bg-white/5 p-5">
        <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8F98AB]">
          Notifications
        </Text>
        <Text className="mb-4 text-base font-semibold text-white">Préférences d'alertes</Text>
        <View className="gap-3">
          {notifications.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => toggleNotification(index)}
              className="flex-row items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F141C] px-4 py-3 active:opacity-70"
            >
              <View
                className={`h-2 w-2 rounded-full ${
                  item.active ? 'bg-[#FF8933]' : 'bg-white/20'
                }`}
              />
              <Text className="flex-1 text-sm leading-relaxed text-[#8F98AB]">
                {item.label}
              </Text>
              <Switch
                value={item.active}
                onValueChange={() => toggleNotification(index)}
                trackColor={{ false: 'rgba(255,255,255,0.12)', true: 'rgba(255,137,51,0.45)' }}
                thumbColor={item.active ? '#FF8933' : '#7A8799'}
                ios_backgroundColor="rgba(255,255,255,0.12)"
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View className="rounded-[28px] border border-white/[0.08] bg-white/5 p-5">
        <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8F98AB]">
          Actions
        </Text>
        <Text className="mb-2 text-base font-semibold text-white">Actions rapides</Text>
        <Text className="mb-5 text-sm leading-relaxed text-[#8F98AB]">
          Réinitialisez les filtres et favoris, ou partagez l'application avec votre équipe.
        </Text>
        <View className="flex-row gap-3">
          <Button
            label="Réinitialiser"
            variant="outline"
            onPress={handleReset}
            className="flex-1 rounded-full border border-white/10 bg-white/5"
            textClassName="text-white"
          />
          <Button
            label="Partager"
            onPress={handleShare}
            className="flex-1 rounded-full bg-[#FF8933]"
            textClassName="text-white font-semibold"
          />
        </View>
      </View>
    </ScreenShell>
  );
}
