import React from 'react';
import { Pressable, View } from 'react-native';
import { Text as TextComponent } from './text';

interface ModeCardProps {
  icon: React.ElementType;
  title: string;
  mode: string;
  description: string;
  currentMode: string;
  onPress: (mode: string) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  icon: Icon,
  title,
  mode,
  description,
  currentMode,
  onPress,
}) => (
  <Pressable
    onPress={() => onPress(mode)}
    className={`p-4 rounded-2xl border mb-4 flex-1 mx-2 ${
      currentMode === mode
        ? 'border-[#FF8933] bg-[#FF8933]/10'
        : 'border-white/[0.08] bg-white/5'
    }`}
  >
    <View className="items-center">
      <Icon
        size={32}
        color={currentMode === mode ? '#FF8933' : '#8F98AB'}
        variant="Bold"
      />
      <TextComponent className="mt-2 font-bold text-center text-white">
        {title}
      </TextComponent>
      <TextComponent className="mt-1 text-xs text-center text-[#8F98AB]">
        {description}
      </TextComponent>
    </View>
  </Pressable>
);