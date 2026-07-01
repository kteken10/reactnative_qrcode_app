import * as React from 'react';
import { View } from '@/components/ui';
import { Text } from '@/components/ui';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View className="items-center rounded-[28px] border border-white/[0.08] bg-white/5 px-6 py-8">
      <View className="mb-4 size-14 rounded-2xl bg-white/10" />
      <Text className="text-center text-lg font-semibold text-white">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-6 text-[#8F98AB]">
        {description}
      </Text>
      {action ? <View className="mt-5">{action}</View> : null}
    </View>
  );
}
