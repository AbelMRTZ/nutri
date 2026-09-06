import { Stack } from 'expo-router';

import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function AppLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ajustes" options={{ presentation: 'modal', title: 'Ajustes' }} />
      <Stack.Screen name="cuenta" options={{ presentation: 'modal', title: 'Cuenta' }} />
    </Stack>
  );
}
