import { Stack } from 'expo-router';

import { TopBar } from '@/features/app-shell';
import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function DespensaLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ header: () => <TopBar /> }} />
      <Stack.Screen name="alimentos/index" options={{ title: 'Alimentos' }} />
      <Stack.Screen name="alimentos/nuevo" options={{ title: 'Nuevo alimento' }} />
      <Stack.Screen name="alimentos/[id]" options={{ title: 'Alimento' }} />
      <Stack.Screen name="alimentos/editar/[id]" options={{ title: 'Editar alimento' }} />
      <Stack.Screen name="alimentos/usda/index" options={{ title: 'Catálogo USDA' }} />
      <Stack.Screen name="alimentos/usda/[id]" options={{ title: 'Alimento (USDA)' }} />
      <Stack.Screen name="comidas" options={{ headerShown: false }} />
      <Stack.Screen name="planes" options={{ headerShown: false }} />
      <Stack.Screen name="investigar/index" options={{ title: 'Investigar Alimentos' }} />
    </Stack>
  );
}
