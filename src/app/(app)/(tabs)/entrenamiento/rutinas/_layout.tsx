import { Stack } from 'expo-router';

import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function RutinasLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Rutinas' }} />
      <Stack.Screen name="nueva" options={{ title: 'Nueva rutina' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar rutina' }} />
      <Stack.Screen name="agregar-ejercicio" options={{ title: 'Añadir ejercicio' }} />
    </Stack>
  );
}
