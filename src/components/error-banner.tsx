import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type ErrorBannerProps = {
  message: string;
  onDismiss: () => void;
  autoDismissMs?: number;
};

/** Boxed error message that dismisses itself after a delay — used for errors the user didn't directly cause by typing (e.g. a blocked delete), so they aren't left on screen forever. */
export function ErrorBanner({ message, onDismiss, autoDismissMs = 5000 }: ErrorBannerProps) {
  const theme = useTheme();

  useEffect(() => {
    const timeout = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <View style={[styles.container, { backgroundColor: `${theme.danger}1A`, borderColor: theme.danger }]}>
      <ThemedText type="small" themeColor="danger">
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
  },
});
