import { Stack } from 'expo-router';

import { TopBar } from '@/features/app-shell';
import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function EntrenamientoLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ header: () => <TopBar /> }} />
      <Stack.Screen name="ejercicios" options={{ headerShown: false }} />
      <Stack.Screen name="rutinas" options={{ headerShown: false }} />
    </Stack>
  );
}
