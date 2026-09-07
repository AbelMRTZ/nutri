import { useLocalSearchParams } from 'expo-router';

import { PlanScheduleScreen } from '@/features/calendar';

export default function ProgramarCalendario() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  return <PlanScheduleScreen planId={planId} />;
}
