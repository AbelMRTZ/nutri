import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type ErrorBannerProps = {
  message: string;
  onDismiss: () => void;
  autoDismissMs?: number;
};

/**
 * Floating toast that dismisses itself after a delay — used for errors the
 * user didn't directly cause by typing (e.g. a blocked delete), so they
 * aren't left on screen forever. Absolutely positioned against whichever
 * container it's rendered in, pinned to its bottom edge, so it overlays
 * existing content instead of shifting it and leaves no gap once it's
 * gone. Render it as a direct sibling of a screen's main `flex: 1`
 * container (not nested inside a list row or a ScrollView) so "bottom"
 * measures against the whole screen area, not some inner scrollable or
 * clipped region — that container also naturally ends right above the
 * bottom tab bar, since the tab bar is a layout sibling of the screen, not
 * an overlay on top of it.
 */
export function ErrorBanner({ message, onDismiss, autoDismissMs = 5000 }: ErrorBannerProps) {
  const theme = useTheme();

  useEffect(() => {
    const timeout = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={[styles.container, { backgroundColor: `${theme.danger}1A`, borderColor: theme.danger }]}>
        <ThemedText type="small" themeColor="danger">
          {message}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    paddingHorizontal: 20,
    zIndex: 50,
    elevation: 50,
  },
  container: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});
