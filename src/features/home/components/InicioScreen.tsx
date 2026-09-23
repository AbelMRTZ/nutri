import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorBanner } from '@/components/error-banner';
import { Screen } from '@/components/screen';
import { CalendarDayPanel } from '@/features/calendar';
import { useAuth } from '@/features/auth';
import { WeightSection } from '@/features/weight';

/** Home tab: weight progression chart, then today's day panel — same plan/activity tracking as Calendario, scoped to today. */
export function InicioScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [today] = useState(() => new Date());
  const [weightError, setWeightError] = useState<string | undefined>();

  return (
    <View style={styles.root}>
      <Screen padded={false}>
        <WeightSection userId={userId} onError={setWeightError} />
        <CalendarDayPanel date={today} userId={userId} />
      </Screen>

      {weightError ? <ErrorBanner message={weightError} onDismiss={() => setWeightError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
