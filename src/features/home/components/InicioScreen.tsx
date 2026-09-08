import { useState } from 'react';

import { Screen } from '@/components/screen';
import { CalendarDayPanel } from '@/features/calendar';
import { useAuth } from '@/features/auth';

/** Home tab: today's day panel — same plan/routine tracking as Calendario, scoped to today. */
export function InicioScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [today] = useState(() => new Date());

  return (
    <Screen padded={false}>
      <CalendarDayPanel date={today} userId={userId} />
    </Screen>
  );
}
