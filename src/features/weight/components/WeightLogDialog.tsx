import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FieldLabel } from '@/components/field-label';
import { NumericField } from '@/components/numeric-field';
import { ThemedText } from '@/components/themed-text';
import { useDeleteWeightLog } from '@/features/weight/hooks/useDeleteWeightLog';
import { useUpsertWeightLog } from '@/features/weight/hooks/useUpsertWeightLog';
import { weightLogFormSchema } from '@/features/weight/schema';
import { useTheme } from '@/hooks/use-theme';
import { addDays, formatDisplayDate, isToday, toDateKey } from '@/lib/dates';

export type WeightLogDialogProps = {
  visible: boolean;
  userId: string | undefined;
  /** date (YYYY-MM-DD) -> existing weight for that day, so the dialog can prefill/edit instead of always creating. */
  existingByDate: Map<string, { id: string; weight_kg: number }>;
  onClose: () => void;
  onError: (message: string) => void;
};

/**
 * One modal for both "log today's weight" and "edit/back-fill a previous
 * day" — stepping the date to a day that already has an entry switches the
 * field (and the dialog) into editing that entry, rather than needing a
 * separate list/edit screen.
 */
export function WeightLogDialog({ visible, userId, existingByDate, onClose, onError }: WeightLogDialogProps) {
  const theme = useTheme();
  const upsertWeightLog = useUpsertWeightLog(userId);
  const deleteWeightLog = useDeleteWeightLog(userId);

  const [date, setDate] = useState(() => new Date());
  const [weightText, setWeightText] = useState<number | undefined>(undefined);
  const [fieldError, setFieldError] = useState<string | undefined>();
  // Modal stays mounted across visibility toggles (same pattern as PromptDialog/ConfirmDialog),
  // so state must be re-seeded from scratch every time it re-opens.
  const [wasVisible, setWasVisible] = useState(visible);

  const dateKey = toDateKey(date);
  const existing = existingByDate.get(dateKey);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      const today = new Date();
      setDate(today);
      setWeightText(existingByDate.get(toDateKey(today))?.weight_kg);
      setFieldError(undefined);
    }
  }

  function changeDate(nextDate: Date) {
    setDate(nextDate);
    setWeightText(existingByDate.get(toDateKey(nextDate))?.weight_kg);
    setFieldError(undefined);
  }

  function handleSave() {
    const result = weightLogFormSchema.safeParse({ weight_kg: weightText });
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message);
      return;
    }

    upsertWeightLog.mutate(
      { date: dateKey, weight_kg: result.data.weight_kg },
      {
        onSuccess: onClose,
        onError: () => onError('No se ha podido guardar el peso. Inténtalo de nuevo.'),
      },
    );
  }

  function handleDelete() {
    if (!existing) return;
    deleteWeightLog.mutate(existing.id, {
      onSuccess: onClose,
      onError: () => onError('No se ha podido eliminar el registro. Inténtalo de nuevo.'),
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={(event) => event.stopPropagation()}>
          <ThemedText type="subtitle" style={styles.title}>
            Registrar peso
          </ThemedText>

          <View style={styles.field}>
            <FieldLabel>Fecha</FieldLabel>
            <View style={[styles.dateRow, { borderColor: theme.border }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Día anterior"
                onPress={() => changeDate(addDays(date, -1))}
                style={styles.dateArrow}>
                <Ionicons name="chevron-back" size={20} color={theme.text} />
              </Pressable>
              <View style={styles.dateLabel}>
                <ThemedText type="smallBold">{formatDisplayDate(date)}</ThemedText>
                {isToday(date) ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    Hoy
                  </ThemedText>
                ) : existing ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    Editando registro
                  </ThemedText>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Día siguiente"
                disabled={isToday(date)}
                onPress={() => changeDate(addDays(date, 1))}
                style={[styles.dateArrow, isToday(date) && styles.dateArrowDisabled]}>
                <Ionicons name="chevron-forward" size={20} color={isToday(date) ? theme.placeholder : theme.text} />
              </Pressable>
            </View>
          </View>

          <NumericField
            label="Peso (kg)"
            value={weightText}
            onChangeNumber={(value) => {
              setWeightText(value);
              setFieldError(undefined);
            }}
            error={fieldError}
            autoFocus
          />

          <View style={styles.buttonsRow}>
            <Button variant="secondary" title="Cancelar" style={styles.flexButton} onPress={onClose} />
            <Button
              variant="primary"
              title="Guardar"
              style={styles.flexButton}
              loading={upsertWeightLog.isPending}
              onPress={handleSave}
            />
          </View>

          {existing ? (
            <Button
              variant="ghost"
              title="Eliminar registro"
              loading={deleteWeightLog.isPending}
              onPress={handleDelete}
            />
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 22,
    gap: 16,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  field: {
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dateArrow: {
    padding: 8,
  },
  dateArrowDisabled: {
    opacity: 0.4,
  },
  dateLabel: {
    flex: 1,
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
