import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { equipmentLabels, muscleGroupLabels } from '@/features/exercises';
import type { RoutineExerciseWithExercise } from '@/features/routines/api/routineExercises';
import { useDeleteRoutineExercise } from '@/features/routines/hooks/useDeleteRoutineExercise';
import { useUpdateRoutineExercise } from '@/features/routines/hooks/useUpdateRoutineExercise';
import { isValidReps, isValidSets, isValidWeight } from '@/features/routines/schema';
import { useTheme } from '@/hooks/use-theme';

export type RoutineExerciseRowProps = {
  item: RoutineExerciseWithExercise;
  routineId: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function RoutineExerciseRow({
  item,
  routineId,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: RoutineExerciseRowProps) {
  const theme = useTheme();
  const updateRoutineExercise = useUpdateRoutineExercise(routineId);
  const deleteRoutineExercise = useDeleteRoutineExercise(routineId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [draftSets, setDraftSets] = useState<number | undefined>(item.sets);
  const [draftReps, setDraftReps] = useState<number | undefined>(item.reps);
  const [draftWeight, setDraftWeight] = useState<number | undefined>(item.weight_kg ?? undefined);

  function commitSets() {
    if (draftSets === undefined || draftSets === item.sets) return;
    if (!isValidSets(draftSets)) {
      setDraftSets(item.sets);
      return;
    }
    updateRoutineExercise.mutate({ id: item.id, updates: { sets: draftSets } });
  }

  function commitReps() {
    if (draftReps === undefined || draftReps === item.reps) return;
    if (!isValidReps(draftReps)) {
      setDraftReps(item.reps);
      return;
    }
    updateRoutineExercise.mutate({ id: item.id, updates: { reps: draftReps } });
  }

  function commitWeight() {
    const previous = item.weight_kg ?? undefined;
    if (draftWeight === previous) return;
    if (draftWeight !== undefined && !isValidWeight(draftWeight)) {
      setDraftWeight(previous);
      return;
    }
    updateRoutineExercise.mutate({ id: item.id, updates: { weight_kg: draftWeight ?? null } });
  }

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.reorderButtons}>
          <Pressable
            accessibilityLabel="Subir ejercicio"
            disabled={!canMoveUp}
            hitSlop={8}
            onPress={onMoveUp}
            style={{ opacity: canMoveUp ? 1 : 0.3 }}>
            <Ionicons name="chevron-up" size={18} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            accessibilityLabel="Bajar ejercicio"
            disabled={!canMoveDown}
            hitSlop={8}
            onPress={onMoveDown}
            style={{ opacity: canMoveDown ? 1 : 0.3 }}>
            <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText type="smallBold">{item.exercise.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {muscleGroupLabels[item.exercise.muscle_group]} · {equipmentLabels[item.exercise.equipment]}
          </ThemedText>
        </View>
        <Pressable accessibilityLabel="Quitar ejercicio" hitSlop={10} onPress={() => setConfirmVisible(true)}>
          <Ionicons name="close-circle-outline" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.paramsRow}>
        <ParamField label="Series" value={draftSets} onChangeNumber={setDraftSets} onBlur={commitSets} />
        <ParamField label="Reps" value={draftReps} onChangeNumber={setDraftReps} onBlur={commitReps} />
        <ParamField label="Kg" value={draftWeight} onChangeNumber={setDraftWeight} onBlur={commitWeight} />
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title="Quitar ejercicio"
        description={`¿Quitar "${item.exercise.name}" de esta rutina?`}
        confirmLabel="Quitar"
        loading={deleteRoutineExercise.isPending}
        onConfirm={() => deleteRoutineExercise.mutate(item.id, { onSuccess: () => setConfirmVisible(false) })}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

function ParamField({
  label,
  value,
  onChangeNumber,
  onBlur,
}: {
  label: string;
  value: number | undefined;
  onChangeNumber: (value: number | undefined) => void;
  onBlur: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.paramField}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={[styles.paramInputBox, { borderColor: theme.border }]}>
        <TextInput
          keyboardType="decimal-pad"
          value={value === undefined ? '' : String(value)}
          onChangeText={(text) => {
            const normalized = text.replace(',', '.');
            if (normalized === '') {
              onChangeNumber(undefined);
              return;
            }
            const parsed = Number(normalized);
            onChangeNumber(Number.isNaN(parsed) ? undefined : parsed);
          }}
          onBlur={onBlur}
          style={[styles.paramInput, { color: theme.text }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reorderButtons: {
    gap: 2,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  paramsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paramField: {
    flex: 1,
    gap: 4,
  },
  paramInputBox: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  paramInput: {
    fontSize: 14,
    textAlign: 'center',
  },
});
