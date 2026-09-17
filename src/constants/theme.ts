/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * "Vibrante / Enérgico" — the app's chosen design direction: near-black
 * structural color, a coral accent for selection/attention states, and a
 * lime accent reserved for progress/positive data visuals.
 */
export const Colors = {
  light: {
    text: '#14121A',
    background: '#FFFFFF',
    backgroundElement: '#F5F4F2',
    backgroundSelected: '#14121A',
    textSecondary: '#5B5B63',
    primary: '#14121A',
    onPrimary: '#FFFFFF',
    accent: '#FF5A3C',
    accentSecondary: '#C4F135',
    danger: '#D6303D',
    success: '#1F9254',
    warning: '#E8A33D',
    border: '#14121A',
    divider: '#EDEDEF',
    placeholder: '#9C9CA5',
    card: '#FFFFFF',
  },
  dark: {
    text: '#F5F5F7',
    background: '#0E0D12',
    backgroundElement: '#1D1B22',
    backgroundSelected: '#F5F5F7',
    textSecondary: '#9C9CA5',
    primary: '#F5F5F7',
    onPrimary: '#0E0D12',
    accent: '#FF6B4F',
    accentSecondary: '#C4F135',
    danger: '#FF6B6B',
    success: '#3DD68C',
    warning: '#F5B84F',
    border: '#F5F5F7',
    divider: '#2A2830',
    placeholder: '#75737C',
    card: '#17151C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * One accent per meal category (Comidas list). Coral/lime reuse the brand
 * accents; amber reuses `warning`'s hue (breakfast/morning is a natural
 * fit); violet and magenta are the only two genuinely new hues, chosen to
 * stay in the same saturated "Vibrante/Enérgico" register. Kept separate
 * from `Colors` (not just another `ThemeColor` key) deliberately: 1) it's
 * meal-domain-specific, not a generic app color; 2) `Colors[light|dark]`
 * must stay a flat string-per-key map — `ThemedText`/`ThemedView` index it
 * generically via `theme[themeColor]` and a nested object there would
 * break that. Also deliberately not reusing `danger`/`success` — coloring
 * a meal category the same red used for delete errors (or green used for
 * "success") would read as a status, not a category.
 */
export const MealCategoryColors = {
  light: {
    main: '#FF5A3C',
    breakfast: '#E8A33D',
    pre_workout: '#C4F135',
    post_workout: '#7C5CFC',
    snack: '#F2419A',
  },
  dark: {
    main: '#FF6B4F',
    breakfast: '#F5B84F',
    pre_workout: '#C4F135',
    post_workout: '#9B85FF',
    snack: '#FF6BB8',
  },
} as const;

/** Space Grotesk for headings/emphasis, Work Sans for body text. */
export const AppFonts = {
  heading: 'SpaceGrotesk_700Bold',
  headingMedium: 'SpaceGrotesk_500Medium',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemiBold: 'WorkSans_600SemiBold',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
