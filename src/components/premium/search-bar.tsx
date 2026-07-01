import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher par titre, dossier ou contenu…',
}: SearchBarProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4D5A6B"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0F141C',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  containerFocused: {
    borderColor: 'rgba(255,137,51,0.55)',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter',
    margin: 0,
    padding: 0,
  },
});
