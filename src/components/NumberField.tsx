import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  value: number;
  onCommit: (n: number) => void;
  decimal?: boolean;
  highlight?: boolean;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  accessibilityLabel?: string;
}

const parse = (t: string): number => {
  const n = parseFloat(t.replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Numeric input that keeps its own text so partial entries like "7." survive,
 * while still syncing when the value changes from outside (e.g. unit switch).
 */
export function NumberField({ value, onCommit, decimal, highlight, style, placeholder = '0', accessibilityLabel }: Props) {
  const [text, setText] = useState(value ? String(value) : '');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused && parse(text) !== value) setText(value ? String(value) : '');
  }, [value, focused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TextInput
      value={text}
      onChangeText={(t) => {
        const clean = decimal ? t.replace(/[^0-9.,]/g, '') : t.replace(/\D/g, '');
        setText(clean);
        onCommit(parse(clean));
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
      selectTextOnFocus
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      maxLength={6}
      style={[styles.input, highlight && styles.highlight, style]}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    borderRadius: radius.sm,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  highlight: { backgroundColor: 'transparent' },
});
