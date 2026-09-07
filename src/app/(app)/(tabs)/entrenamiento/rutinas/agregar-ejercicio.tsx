import { useLocalSearchParams } from 'expo-router';

import { ExercisePickerScreen } from '@/features/routines';

export default function AgregarEjercicio() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  return <ExercisePickerScreen routineId={routineId} />;
}
