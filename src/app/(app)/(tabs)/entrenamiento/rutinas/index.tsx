import { Stack } from 'expo-router';

import { RoutinesListScreen, RutinasHeaderActions } from '@/features/routines';

export default function RutinasIndex() {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <RutinasHeaderActions /> }} />
      <RoutinesListScreen />
    </>
  );
}
