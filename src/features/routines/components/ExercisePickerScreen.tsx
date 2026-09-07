import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { OptionPicker } from '@/components/option-picker';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { muscleGroupLabels, muscleGroupOptions, useExercises } from '@/features/exercises';
import { ExercisePickerListItem } from '@/features/routines/components/ExercisePickerListItem';
import { useAddExerciseToRoutine } from '@/features/routines/hooks/useAddExerciseToRoutine';

const ALL_GROUPS = 'all' as const;
const groupFilterOptions = [
  { value: ALL_GROUPS, label: 'Todos' },
  ...muscleGroupOptions.map((value) => ({ value, label: muscleGroupLabels[value] })),
];

export type ExercisePickerScreenProps = {
  routineId: string;
};

export function ExercisePickerScreen({ routineId }: ExercisePickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: exercises, isLoading } = useExercises(userId);
  const addExerciseToRoutine = useAddExerciseToRoutine(routineId);
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<(typeof groupFilterOptions)[number]['value']>(ALL_GROUPS);

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((exercise) => {
      const matchesGroup = muscleGroup === ALL_GROUPS || exercise.muscle_group === muscleGroup;
      const matchesSearch = exercise.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [exercises, muscleGroup, search]);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  function handlePick(exerciseId: string) {
    addExerciseToRoutine.mutate(exerciseId, { onSuccess: () => router.back() });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <TextField label="Buscar" placeholder="Nombre del ejercicio" value={search} onChangeText={setSearch} />
      <OptionPicker label="Grupo muscular" options={groupFilterOptions} value={muscleGroup} onChange={setMuscleGroup} />

      {filteredExercises.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          No se han encontrado ejercicios.
        </ThemedText>
      ) : (
        <FlatList
          style={styles.flexList}
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ExercisePickerListItem exercise={item} onPress={() => handlePick(item.id)} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
  },
  flexList: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
});
