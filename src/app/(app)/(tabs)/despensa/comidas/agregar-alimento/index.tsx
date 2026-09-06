import { useLocalSearchParams } from 'expo-router';

import { FoodPickerScreen } from '@/features/meals';

export default function AgregarAlimento() {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
  return <FoodPickerScreen mealId={mealId} />;
}
