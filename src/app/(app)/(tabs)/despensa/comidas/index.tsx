import { Stack } from 'expo-router';

import { ComidasHeaderActions, MealsListScreen } from '@/features/meals';

export default function ComidasIndex() {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <ComidasHeaderActions /> }} />
      <MealsListScreen />
    </>
  );
}
