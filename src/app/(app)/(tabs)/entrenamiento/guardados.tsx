import { useLocalSearchParams } from 'expo-router';

import { SavedActivityPickerScreen } from '@/features/training';

export default function EntrenosGuardados() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return <SavedActivityPickerScreen date={date} />;
}
