import { useLocalSearchParams } from 'expo-router';

import { QuantityScreen } from '@/features/meals';

export default function SeleccionarCantidad() {
  const { foodId, mealId } = useLocalSearchParams<{ foodId: string; mealId: string }>();
  return <QuantityScreen foodId={foodId} mealId={mealId} />;
}
