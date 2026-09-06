import { Ionicons } from '@expo/vector-icons';
import { useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type CollapsibleSectionProps = PropsWithChildren<{
  title: string;
  defaultExpanded?: boolean;
}>;

/** Expandable header used to group optional form fields without one long scroll. */
export function CollapsibleSection({ title, defaultExpanded = false, children }: CollapsibleSectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={[styles.container, { borderColor: theme.divider }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        style={styles.header}
        onPress={() => setExpanded((current) => !current)}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={theme.text} />
      </Pressable>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  content: {
    gap: 16,
    paddingBottom: 16,
  },
});
