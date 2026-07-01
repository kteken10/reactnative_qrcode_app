import * as React from 'react';
import { Pressable } from 'react-native';

import { Text } from '@/components/ui';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: active ? '#FF8933' : 'rgba(255,255,255,0.08)',
        backgroundColor: active ? '#FF8933' : pressed ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
      })}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: active ? '#FFFFFF' : '#8F98AB',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
