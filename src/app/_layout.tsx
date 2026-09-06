import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { AuthProvider, useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { queryClient } from '@/lib/queryClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/**
 * Three mutually-exclusive route groups, one per auth/onboarding state.
 * Stack.Protected declaratively mounts/redirects between them as `guard`
 * changes, so no group needs its own manual redirect logic.
 */
function RootNavigator() {
  const { session, isLoading: isSessionLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile(session?.user.id);

  const isReady = !isSessionLoading && (!session || !isProfileLoading);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <FullScreenSpinner />;
  }

  const isOnboarded = !!profile?.onboarding_completed;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && !isOnboarded}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && isOnboarded}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
