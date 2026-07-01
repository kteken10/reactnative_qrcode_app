import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import * as React from 'react';
import { Alert, Pressable, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { ScreenShell, SectionHeader } from '@/components/premium';
import { Button, Text } from '@/components/ui';
import { weeklyScans } from '@/data/demo';

const MAX_BAR_HEIGHT = 110;
const maxValue = Math.max(...weeklyScans.map((b) => b.value));
const totalThisWeek = weeklyScans.reduce((sum, b) => sum + b.value, 0);

const REPORTING_ITEMS = [
  {
    label: 'Suivi de source',
    color: '#00D2B3',
    detail: 'QR, NFC, Liens profonds',
  },
  {
    label: 'Répartition appareils',
    color: '#00D2B3',
    detail: '72% mobile · 28% bureau',
  },
  {
    label: 'Géographie',
    color: '#00D2B3',
    detail: 'FR, US, UK — marchés principaux',
  },
  {
    label: 'Performance campagnes',
    color: '#00D2B3',
    detail: '+18% vs semaine dernière',
  },
];

export default function AnalyticsScreen() {
  const handleReportItem = async (item: (typeof REPORTING_ITEMS)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(item.label, item.detail);
  };

  const handleExport = async () => {
    const report = [
      `QR Studio — Rapport Hebdomadaire`,
      ``,
      `Total des scans cette semaine : ${totalThisWeek}`,
      ``,
      ...weeklyScans.map((b) => `${b.day}: ${b.value} scans`),
      ``,
      `Segment principal : Mobile / iPhone (72%)`,
      `Conversion : 18,2%`,
    ].join('\n');

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      const { File, cacheDirectory } = await import('expo-file-system');
      const file = new File(`${cacheDirectory}qrstudio-report.txt`);
      await file.write(report);
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/plain',
        dialogTitle: 'Exporter le rapport',
      });
    } else {
      Alert.alert('Export', report);
    }
  };

  return (
    <ScreenShell>
      <SectionHeader eyebrow="Analytics" title="Performances" />

      {/* Bar chart card */}
      <View className="mb-5 rounded-[28px] border border-white/[0.08] bg-white/5 p-5">
        <View className="mb-4 flex-row items-start justify-between">
          <Text className="text-xs uppercase tracking-widest text-[#8F98AB]">
            Volume hebdomadaire
          </Text>
          <View className="rounded-full bg-[#00D2B3]/10 px-3 py-1">
            <Text className="text-xs font-semibold text-[#00D2B3]">
              {totalThisWeek} total
            </Text>
          </View>
        </View>

        <View className="mb-5 rounded-[20px] border border-white/[0.06] bg-[#0F141C] px-4 py-3">
          <Text className="text-xs text-[#8F98AB]">Total cette semaine</Text>
          <View className="mt-1 flex-row items-baseline gap-2">
            <Text className="text-3xl font-semibold text-white">
              {totalThisWeek}
            </Text>
            <Text className="text-sm text-[#00D2B3]">scans</Text>
          </View>
        </View>

        <View className="flex-row items-end gap-[6px]">
          {weeklyScans.map((bar, index) => {
            const barHeight = Math.max(
              12,
              (bar.value / maxValue) * MAX_BAR_HEIGHT
            );
            const gradientId = `bar-grad-${index}`;
            return (
              <View key={bar.day} className="flex-1 items-center gap-[6px]">
                <Text className="text-[10px] font-semibold text-white">
                  {bar.value}
                </Text>
                <View
                  style={{
                    height: barHeight,
                    width: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Svg width="100%" height="100%">
                    <Defs>
                      <LinearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop offset="0" stopColor="#00D2B3" stopOpacity="1" />
                        <Stop
                          offset="1"
                          stopColor="#00D2B3"
                          stopOpacity="0.35"
                        />
                      </LinearGradient>
                    </Defs>
                    <Rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill={`url(#${gradientId})`}
                      rx="8"
                    />
                  </Svg>
                </View>
                <Text className="text-[10px] text-[#7A8799]">{bar.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Metric cards */}
      <View className="mb-5 flex-row gap-3">
        <View className="flex-1 rounded-[20px] border border-white/[0.08] bg-white/5 p-4">
          <Text className="text-xs uppercase tracking-widest text-[#8F98AB]">
            Segment principal
          </Text>
          <View className="mb-2 mt-3 h-[3px] w-8 rounded-full bg-[#00D2B3]" />
          <Text className="text-2xl font-semibold text-white">
            Mobile / iPhone
          </Text>
          <Text className="mt-2 text-sm text-[#7A8799]">
            72% des scans proviennent d'appareils mobiles.
          </Text>
        </View>
        <View className="flex-1 rounded-[20px] border border-white/[0.08] bg-white/5 p-4">
          <Text className="text-xs uppercase tracking-widest text-[#8F98AB]">
            Conversion
          </Text>
          <View className="mb-2 mt-3 h-[3px] w-8 rounded-full bg-[#00D2B3]" />
          <Text className="text-2xl font-semibold text-white">18,2%</Text>
          <Text className="mt-2 text-sm text-[#7A8799]">
            Du visionnage au scan ces 7 derniers jours.
          </Text>
        </View>
      </View>

      {/* Advanced reporting */}
      <View className="rounded-[28px] border border-white/[0.08] bg-white/5 p-5">
        <Text className="text-lg font-semibold text-white">
          Rapports avancés
        </Text>
        <View className="mt-4 gap-3">
          {REPORTING_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => handleReportItem(item)}
              className="flex-row items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0F141C] px-4 py-3 active:opacity-60"
            >
              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: item.color }}
                  className="size-2 rounded-full"
                />
                <View>
                  <Text className="text-sm text-white">{item.label}</Text>
                  <Text className="mt-0.5 text-xs text-[#8F98AB]">
                    {item.detail}
                  </Text>
                </View>
              </View>
              <Text className="text-base text-[#8F98AB]">›</Text>
            </Pressable>
          ))}
        </View>
        <Button
          label="Exporter le rapport"
          onPress={handleExport}
          className="mt-5 h-[52px] rounded-full bg-[#FF8933]"
          textClassName="text-white font-semibold"
        />
      </View>
    </ScreenShell>
  );
}
