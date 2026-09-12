import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { activityTypeLabels } from '@/features/training/schema';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type SavedActivityListItemProps = {
  template: Tables<'saved_activities'>;
  onApply: () => void;
  onDelete: () => void;
  applying?: boolean;
  deleting?: boolean;
};

export function SavedActivityListItem({ template, onApply, onDelete, applying, deleting }: SavedActivityListItemProps) {
  const theme = useTheme();
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        disabled={applying}
        style={[styles.row, { borderColor: theme.border, opacity: applying ? 0.6 : 1 }]}
        onPress={onApply}>
        <View style={styles.info}>
          <ThemedText type="smallBold">{template.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {activityTypeLabels[template.activity_type]} · {template.calories_burned} kcal
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eliminar entreno guardado"
          hitSlop={10}
          disabled={deleting}
          onPress={() => setConfirmVisible(true)}>
          <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
        </Pressable>
      </Pressable>

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar entreno guardado"
        description={`¿Seguro que quieres eliminar "${template.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={() => {
          onDelete();
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
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
