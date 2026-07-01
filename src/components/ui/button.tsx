import * as Haptics from 'expo-haptics';
import React from 'react';
import type { PressableProps } from 'react-native';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';
import { Text } from '@/components/ui/text';

const button = tv({
  slots: {
    container: 'flex flex-row items-center justify-center rounded-full px-6',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6',
    icon: 'mr-2',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-[#FF8933]',
        label: 'text-white',
        indicator: 'text-white',
        icon: 'text-white',
      },
      glass: {
        container: 'bg-white/5 border border-white/10',
        label: 'text-white',
        indicator: 'text-white',
        icon: 'text-white',
      },
      outline: {
        container: 'border border-white/15 bg-transparent',
        label: 'text-white',
        indicator: 'text-white',
        icon: 'text-white',
      },
      destructive: {
        container: 'bg-[#FF8933]',
        label: 'text-white',
        indicator: 'text-white',
        icon: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-[#8F98AB]',
        indicator: 'text-[#8F98AB]',
        icon: 'text-[#8F98AB]',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-[#FF8933] underline',
        indicator: 'text-[#FF8933]',
        icon: 'text-[#FF8933]',
      },
    },
    size: {
      default: {
        container: 'h-[52px] px-6',
        label: 'text-base',
        icon: 'size-5',
      },
      lg: {
        container: 'h-[56px] px-8',
        label: 'text-lg',
        icon: 'size-6',
      },
      md: {
        container: 'h-[44px] px-5',
        label: 'text-sm',
        icon: 'size-5',
      },
      sm: {
        container: 'h-[36px] px-4',
        label: 'text-sm',
        indicator: 'h-4',
        icon: 'size-4',
      },
      icon: {
        container: 'size-[52px] px-0',
        icon: 'size-5',
      },
    },
    disabled: {
      true: {
        container: 'opacity-40',
      },
    },
    fullWidth: {
      true: {
        container: 'w-full',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    const indicatorColor =
      variant === 'default' ? '#FFFFFF'
      : variant === 'destructive' ? '#FFFFFF'
      : variant === 'ghost' ? '#8F98AB'
      : variant === 'link' ? '#FF8933'
      : '#FFFFFF';

    const renderContent = () => {
      if (children) return children;

      if (loading) {
        return (
          <ActivityIndicator
            size="small"
            color={indicatorColor}
            testID={testID ? `${testID}-activity-indicator` : undefined}
          />
        );
      }

      return (
        <>
          {icon && iconPosition === 'left' && (
            <View className={styles.icon()}>{icon}</View>
          )}
          {text && (
            <Text
              testID={testID ? `${testID}-label` : undefined}
              className={styles.label({ className: textClassName })}
            >
              {text}
            </Text>
          )}
          {icon && iconPosition === 'right' && (
            <View className={styles.icon()}>{icon}</View>
          )}
        </>
      );
    };

    const handlePress: PressableProps['onPress'] = (e) => {
      if (Platform.OS === 'ios' && !disabled && !loading) {
        Haptics.impactAsync(
          variant === 'default' || variant === 'destructive'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );
      }
      props.onPress?.(e);
    };

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        className={styles.container({ className })}
        testID={testID}
        {...props}
        onPress={handlePress}
        style={({ pressed }) => [
          typeof props.style === 'function' ? props.style({ pressed }) : props.style,
          pressed && { opacity: 0.82 },
        ]}
      >
        {renderContent()}
      </Pressable>
    );
  }
);
