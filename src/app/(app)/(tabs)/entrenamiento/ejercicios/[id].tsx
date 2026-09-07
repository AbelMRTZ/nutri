import { useLocalSearchParams } from 'expo-router';

import { EditExerciseScreen } from '@/features/exercises';

export default function EditarEjercicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditExerciseScreen id={id} />;
}
