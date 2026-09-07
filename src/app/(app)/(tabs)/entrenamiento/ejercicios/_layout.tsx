import { Stack } from 'expo-router';

import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function EjerciciosLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Ejercicios' }} />
      <Stack.Screen name="nuevo" options={{ title: 'Nuevo ejercicio' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar ejercicio' }} />
    </Stack>
  );
}
