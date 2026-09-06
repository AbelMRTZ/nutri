import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

/**
 * Text-only placeholder wordmark. The real logo/branding is decided in the
 * upcoming visual-design pass — this just needs to occupy the top bar's
 * center slot consistently until then.
 */
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
