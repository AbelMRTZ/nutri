import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { planTypeLabels } from '@/features/plans';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type AssignedPlanSummaryProps = {
  plan: Tables<'plans'>;
  editLoading?: boolean;
  onEdit: () => void;
  onRemove: () => void;
};

/** Compact card for a plan assigned to a calendar day, with edit/remove actions. */
export function AssignedPlanSummary({ plan, editLoading, onEdit, onRemove }: AssignedPlanSummaryProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{plan.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {planTypeLabels[plan.is_special ? 'special' : 'standard']}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <Button variant="secondary" title="Editar" style={styles.flexButton} loading={editLoading} onPress={onEdit} />
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
  info: {
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
