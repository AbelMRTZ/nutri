import { Stack } from 'expo-router';

import { PlanesHeaderActions, PlansListScreen } from '@/features/plans';

export default function PlanesIndex() {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <PlanesHeaderActions /> }} />
      <PlansListScreen />
    </>
  );
}
