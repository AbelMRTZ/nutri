import { useLocalSearchParams } from 'expo-router';

import { MealPickerScreen } from '@/features/plans';

export default function AgregarComida() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  return <MealPickerScreen planId={planId} />;
}
