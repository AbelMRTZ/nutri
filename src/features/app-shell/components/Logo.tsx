import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

/** Wordmark for the "Vibrante" design direction: a small solid square + bold heading type. */
export function Logo() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: theme.primary }]} />
      <ThemedText type="smallBold">Nutri</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 9,
    height: 9,
  },
});
