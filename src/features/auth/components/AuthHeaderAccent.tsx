import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** The diagonal coral block + lime dot flourish that opens Login/Signup. */
export function AuthHeaderAccent() {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={[styles.diagonal, { backgroundColor: theme.accent }]} />
      <View style={[styles.dot, { backgroundColor: theme.accentSecondary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 150,
    overflow: 'hidden',
  },
  diagonal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 220,
    height: 180,
    transform: [{ skewX: '-12deg' }, { translateX: 60 }],
  },
  dot: {
    position: 'absolute',
    top: 56,
    right: 26,
    width: 14,
    height: 14,
    borderRadius: 999,
  },
});
