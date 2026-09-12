import { Stack } from 'expo-router';

import { TopBar } from '@/features/app-shell';
import { useThemedStackScreenOptions } from '@/hooks/use-themed-stack-options';

export default function EntrenamientoLayout() {
  const screenOptions = useThemedStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ header: () => <TopBar /> }} />
      <Stack.Screen name="nueva-actividad" options={{ title: 'Nueva actividad' }} />
      <Stack.Screen name="actividad/[id]" options={{ title: 'Editar actividad' }} />
      <Stack.Screen name="guardados" options={{ title: 'Entrenos guardados' }} />
    </Stack>
  );
}
