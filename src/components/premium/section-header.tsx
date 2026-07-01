import * as React from 'react';
import { Pressable, View } from '@/components/ui';
import { Text } from '@/components/ui';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View className="mb-5 flex-row items-center justify-between gap-3">
      <View className="flex-1">
        {eyebrow ? (
          <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8F98AB]">
            {eyebrow}
          </Text>
        ) : null}
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: -0.4,
            lineHeight: 28,
          }}
        >
          {title}
        </Text>
        {description ? (
          <Text className="mt-1.5 text-sm leading-[21px] text-[#8F98AB]">
            {description}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="rounded-full px-3 py-1.5 active:opacity-60"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <Text className="text-xs font-semibold text-[#8F98AB]">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
