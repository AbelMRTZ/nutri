import { AppFonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Shared themed header options for any Stack navigator in the app. */
export function useThemedStackScreenOptions() {
  const theme = useTheme();

  return {
    headerStyle: { backgroundColor: theme.background },
    headerTintColor: theme.text,
    headerTitleStyle: { fontFamily: AppFonts.heading, fontSize: 17 },
    headerShadowVisible: false,
  } as const;
}
