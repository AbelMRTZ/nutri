import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { TrainingDayPanel } from '@/features/training/components/TrainingDayPanel';
import { TrainingDayStrip } from '@/features/training/components/TrainingDayStrip';
import { fromDateKey, toDateKey } from '@/lib/dates';

/** Entrenamiento tab landing screen: a day-based calendar for activities, mirroring how Calendario works for nutrition plans. */
export function EntrenamientoCalendarScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { date: initialDateKey } = useLocalSearchParams<{ date?: string }>();
  const [selectedDate, setSelectedDate] = useState(() => (initialDateKey ? fromDateKey(initialDateKey) : new Date()));

  return (
    <Screen padded={false}>
      <TrainingDayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} userId={userId} />
      <ScrollView>
        <TrainingDayPanel dateKey={toDateKey(selectedDate)} userId={userId} />
      </ScrollView>
    </Screen>
  );
}
