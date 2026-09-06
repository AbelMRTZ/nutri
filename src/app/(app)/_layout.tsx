import { Stack } from 'expo-router';

import { AppFonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: { fontFamily: AppFonts.heading, fontSize: 17 },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ajustes" options={{ presentation: 'modal', title: 'Ajustes' }} />
      <Stack.Screen name="cuenta" options={{ presentation: 'modal', title: 'Cuenta' }} />
    </Stack>
  );
}
