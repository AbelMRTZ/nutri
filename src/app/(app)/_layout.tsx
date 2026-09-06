import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ajustes" options={{ presentation: 'modal', title: 'Ajustes' }} />
      <Stack.Screen name="cuenta" options={{ presentation: 'modal', title: 'Cuenta' }} />
    </Stack>
  );
}
