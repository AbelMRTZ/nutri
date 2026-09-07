import { useLocalSearchParams } from 'expo-router';

import { RoutineDetailScreen } from '@/features/routines';

export default function EditarRutina() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RoutineDetailScreen id={id} />;
}
