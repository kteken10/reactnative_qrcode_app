import React from 'react';
import type { TextProps } from 'react-native';
import { Text as NNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface Props extends TextProps {
  className?: string;
}

export const Text = ({
  className = '',
  style,
  children,
  ...props
}: Props) => {
  const textStyle = React.useMemo(
    () =>
      twMerge(
        'text-base text-white font-inter font-normal',
        className
      ),
    [className]
  );

  return (
    <NNText className={textStyle} style={style} {...props}>
      {children}
    </NNText>
  );
};
