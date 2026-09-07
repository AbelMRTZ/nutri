import { useState } from 'react';

import { Screen } from '@/components/screen';
import { CalendarDayPanel } from '@/features/calendar/components/CalendarDayPanel';
import { DayStrip } from '@/features/calendar/components/DayStrip';
import { useAuth } from '@/features/auth';

export function CalendarScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  return (
    <Screen padded={false}>
      <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} userId={userId} />
      <CalendarDayPanel date={selectedDate} userId={userId} />
    </Screen>
  );
}
