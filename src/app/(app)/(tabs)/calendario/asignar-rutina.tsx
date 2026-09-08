import { useLocalSearchParams } from 'expo-router';

import { RoutineAssignmentPickerScreen } from '@/features/calendar';

export default function AsignarRutina() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return <RoutineAssignmentPickerScreen date={date} />;
}
