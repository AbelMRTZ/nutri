import { useLocalSearchParams } from 'expo-router';

import { CreateActivityScreen } from '@/features/training';

export default function NuevaActividad() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return <CreateActivityScreen date={date} />;
}
