import { Stack } from 'expo-router';

import { TopBar } from '@/features/app-shell';
import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function CalendarioLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ header: () => <TopBar /> }} />
      <Stack.Screen name="asignar-plan" options={{ title: 'Asignar plan' }} />
      <Stack.Screen name="asignar-rutina" options={{ title: 'Asignar rutina' }} />
    </Stack>
  );
}
