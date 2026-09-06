import { useLocalSearchParams } from 'expo-router';

import { MealDetailScreen } from '@/features/meals';

export default function EditarComida() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MealDetailScreen id={id} />;
}
