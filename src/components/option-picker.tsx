import { Pressable, StyleSheet, View } from 'react-native';

import { FieldLabel } from '@/components/field-label';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type Option<T extends string> = {
  value: T;
  label: string;
};

export type OptionPickerProps<T extends string> = {
  label: string;
  options: readonly Option<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
};

export function OptionPicker<T extends string>({ label, options, value, onChange, error }: OptionPickerProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={[
                styles.pill,
                {
                  backgroundColor: selected ? theme.accent : 'transparent',
                  borderColor: error ? theme.danger : selected ? theme.accent : theme.border,
                },
              ]}>
              <ThemedText type="smallBold" style={{ color: selected ? '#FFFFFF' : theme.text }}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
