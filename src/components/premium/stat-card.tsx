import * as React from 'react';
import { View } from '@/components/ui';
import { Text } from '@/components/ui';

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: 'amber' | 'teal' | 'violet' | 'rose';
};

// Monochrome absolu : tous les tons pointent vers l'amber
const toneMap = {
  amber: { bg: 'rgba(255,137,51,0.10)', border: 'rgba(255,137,51,0.22)', accent: '#FF8933' },
  teal:  { bg: 'rgba(255,137,51,0.10)', border: 'rgba(255,137,51,0.22)', accent: '#FF8933' },
  violet:{ bg: 'rgba(255,137,51,0.10)', border: 'rgba(255,137,51,0.22)', accent: '#FF8933' },
  rose:  { bg: 'rgba(255,137,51,0.10)', border: 'rgba(255,137,51,0.22)', accent: '#FF8933' },
};

export function StatCard({
  label,
  value,
  change,
  tone = 'amber',
}: StatCardProps) {
  const t = toneMap[tone];
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: '#0F141C',
        padding: 16,
      }}
    >
      {/* Accent bar */}
      <View style={{ width: 28, height: 3, borderRadius: 2, backgroundColor: t.accent, marginBottom: 14 }} />
      <Text style={{ fontSize: 11, fontWeight: '600', color: '#8F98AB', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.6, lineHeight: 30 }}>
        {value}
      </Text>
      <Text style={{ marginTop: 6, fontSize: 12, color: t.accent, fontWeight: '500' }}>{change}</Text>
    </View>
  );
}
