import { useLocalSearchParams } from 'expo-router';

import { FoodSubstitutionPickerScreen } from '@/features/plans';

export default function SustituirAlimento() {
  const { planId, planItemFoodId } = useLocalSearchParams<{ planId: string; planItemFoodId: string }>();
  return <FoodSubstitutionPickerScreen planId={planId} planItemFoodId={planItemFoodId} />;
}
