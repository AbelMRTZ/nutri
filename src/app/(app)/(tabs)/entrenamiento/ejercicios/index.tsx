import { Stack } from 'expo-router';

import { EjerciciosHeaderActions, ExercisesListScreen } from '@/features/exercises';

export default function EjerciciosIndex() {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <EjerciciosHeaderActions /> }} />
      <ExercisesListScreen />
    </>
  );
}
