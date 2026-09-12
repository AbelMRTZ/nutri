import { useLocalSearchParams } from 'expo-router';

import { EditActivityScreen } from '@/features/training';

export default function EditarActividad() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditActivityScreen id={id} />;
}
