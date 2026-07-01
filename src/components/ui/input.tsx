import * as React from 'react';
import type { TextInputProps } from 'react-native';
import { I18nManager, StyleSheet, TextInput as NTextInput, View } from 'react-native';

import { Text } from './text';

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const { label, error, disabled, testID, style, ...inputProps } = props;
  const [isFocused, setIsFocused] = React.useState(false);

  const onBlur = React.useCallback(() => setIsFocused(false), []);
  const onFocus = React.useCallback(() => setIsFocused(true), []);

  const borderColor = error
    ? 'rgba(255,137,51,0.6)'
    : isFocused
      ? 'rgba(255,137,51,0.55)'
      : 'rgba(255,255,255,0.08)';

  return (
    <View style={styles.container}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          style={[styles.label, error ? styles.labelError : undefined]}
        >
          {label}
        </Text>
      )}
      <NTextInput
        ref={ref}
        testID={testID}
        placeholderTextColor="#4D5A6B"
        onBlur={onBlur}
        onFocus={onFocus}
        editable={!disabled}
        {...inputProps}
        style={StyleSheet.flatten([
          styles.input,
          { borderColor },
          disabled && styles.inputDisabled,
          { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
          { textAlign: I18nManager.isRTL ? 'right' : 'left' },
          style,
        ])}
      />
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    color: '#8F98AB',
    marginBottom: 8,
  },
  labelError: {
    color: '#FF8933',
  },
  input: {
    backgroundColor: '#0F141C',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter',
  },
  inputDisabled: {
    opacity: 0.45,
  },
  errorText: {
    fontSize: 12,
    color: '#FF8933',
    marginTop: 6,
  },
});
