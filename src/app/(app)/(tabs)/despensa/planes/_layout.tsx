import { Stack } from 'expo-router';

import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function PlanesLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Planes' }} />
      <Stack.Screen name="nuevo" options={{ title: 'Nuevo plan' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar plan' }} />
      <Stack.Screen name="agregar-comida" options={{ title: 'Añadir comida' }} />
      <Stack.Screen name="sustituir-alimento" options={{ title: 'Sustituir alimento' }} />
      <Stack.Screen name="programar-calendario" options={{ title: 'Programar en calendario' }} />
    </Stack>
  );
}
