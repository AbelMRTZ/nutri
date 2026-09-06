import Slider from '@react-native-community/slider';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type LabeledSliderProps = {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  formatValue?: (value: number) => string;
  onValueChange: (value: number) => void;
  error?: string;
};

export function LabeledSlider({
  label,
  value,
  minimumValue,
  maximumValue,
  step = 0.1,
  formatValue = (v) => v.toFixed(1),
  onValueChange,
  error,
}: LabeledSliderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
        <ThemedText type="smallBold">{formatValue(value)}</ThemedText>
      </View>
      <Slider
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.backgroundElement}
        thumbTintColor={theme.primary}
      />
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
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
