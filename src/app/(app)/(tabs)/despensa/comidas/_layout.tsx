import { Stack } from 'expo-router';

import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function ComidasLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Comidas' }} />
      <Stack.Screen name="nueva" options={{ title: 'Nueva comida' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar comida' }} />
      <Stack.Screen name="agregar-alimento/index" options={{ title: 'Añadir alimento' }} />
      <Stack.Screen name="agregar-alimento/[foodId]" options={{ title: 'Cantidad' }} />
    </Stack>
  );
}
