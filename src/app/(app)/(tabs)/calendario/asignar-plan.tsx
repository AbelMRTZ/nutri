import { useLocalSearchParams } from 'expo-router';

import { PlanAssignmentPickerScreen } from '@/features/calendar';

export default function AsignarPlan() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return <PlanAssignmentPickerScreen date={date} />;
}
