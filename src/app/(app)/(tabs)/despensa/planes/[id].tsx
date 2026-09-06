import { useLocalSearchParams } from 'expo-router';

import { PlanDetailScreen } from '@/features/plans';

export default function EditarPlan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlanDetailScreen id={id} />;
}
