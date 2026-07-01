import { Image } from 'expo-image';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui';

type BrandMarkProps = {
  size?: 'sm' | 'md';
};

export function BrandMark({ size = 'md' }: BrandMarkProps) {
  const imgSize = size === 'sm' ? 32 : 44;
  const radius = size === 'sm' ? 8 : 12;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: imgSize, height: imgSize, borderRadius: radius }}
        contentFit="cover"
      />
      <View>
        <Text className="text-[10px] uppercase tracking-[0.32em] text-[#8F98AB]">
          Aurum
        </Text>
        <Text className="mt-0.5 text-base font-semibold tracking-[0.04em] text-white">
          QR Studio
        </Text>
      </View>
    </View>
  );
}
