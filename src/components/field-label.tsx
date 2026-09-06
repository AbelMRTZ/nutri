import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppFonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Shared uppercase tracked field label used by every form input. */
export function FieldLabel({ children }: { children: string }) {
  const theme = useTheme();
  return <ThemedText style={[styles.label, { color: theme.text }]}>{children}</ThemedText>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: AppFonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
});
