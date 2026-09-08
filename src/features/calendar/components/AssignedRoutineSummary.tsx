import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type AssignedRoutineSummaryProps = {
  routine: Tables<'routines'>;
  onEdit: () => void;
  onRemove: () => void;
};

/** Compact card for a routine assigned to a calendar day, with edit/remove actions. */
export function AssignedRoutineSummary({ routine, onEdit, onRemove }: AssignedRoutineSummaryProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <ThemedText type="smallBold">{routine.name}</ThemedText>
      <View style={styles.actions}>
        <Button variant="secondary" title="Editar" style={styles.flexButton} onPress={onEdit} />
        <Button variant="ghost" title="Quitar" style={styles.flexButton} onPress={onRemove} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    gap: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
