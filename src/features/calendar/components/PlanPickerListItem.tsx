import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { planTypeLabels } from '@/features/plans';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type PlanPickerListItemProps = {
  plan: Tables<'plans'>;
  onPress: () => void;
};

export function PlanPickerListItem({ plan, onPress }: PlanPickerListItemProps) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.row, { borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{plan.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {planTypeLabels[plan.is_special ? 'special' : 'standard']}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
