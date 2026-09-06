import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/features/app-shell/components/Logo';
import { useTheme } from '@/hooks/use-theme';

export function TopBar() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.divider, paddingTop: insets.top + 8 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajustes"
        hitSlop={12}
        onPress={() => router.push('/(app)/ajustes')}>
        <Ionicons name="settings-outline" size={24} color={theme.text} />
      </Pressable>

      <Logo />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cuenta"
        hitSlop={12}
        onPress={() => router.push('/(app)/cuenta')}>
        <Ionicons name="person-circle-outline" size={26} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
