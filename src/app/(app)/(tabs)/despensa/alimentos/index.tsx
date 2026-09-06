import { Stack } from 'expo-router';

import { AlimentosHeaderActions, FoodsListScreen } from '@/features/foods';

export default function AlimentosIndex() {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <AlimentosHeaderActions /> }} />
      <FoodsListScreen />
    </>
  );
}
