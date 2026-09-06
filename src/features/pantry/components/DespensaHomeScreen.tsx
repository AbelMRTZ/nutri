import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const MENU_ITEMS = [
  { icon: 'nutrition-outline', label: 'Alimentos', href: '/(app)/(tabs)/despensa/alimentos' },
  { icon: 'restaurant-outline', label: 'Comidas', href: '/(app)/(tabs)/despensa/comidas' },
  { icon: 'calendar-outline', label: 'Planes', href: '/(app)/(tabs)/despensa/planes' },
  { icon: 'search-outline', label: 'Investigar Alimentos', href: '/(app)/(tabs)/despensa/investigar' },
] as const;

export function DespensaHomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      {MENU_ITEMS.map((item) => (
        <Pressable
          key={item.href}
          style={[styles.row, { borderColor: theme.border }]}
          onPress={() => router.push(item.href)}>
          <View style={[styles.iconBox, { backgroundColor: theme.primary }]}>
            <Ionicons name={item.icon} size={20} color={theme.accentSecondary} />
          </View>
          <ThemedText type="smallBold" style={styles.label}>
            {item.label}
          </ThemedText>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
