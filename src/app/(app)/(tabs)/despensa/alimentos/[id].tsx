import { useLocalSearchParams } from 'expo-router';

import { FoodDetailScreen } from '@/features/foods';

export default function DetalleAlimento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FoodDetailScreen id={id} />;
}
